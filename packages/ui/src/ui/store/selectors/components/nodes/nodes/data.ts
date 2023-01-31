import _ from 'lodash';
import hammer from '../../../../../common/hammer';
import {createSelector} from 'reselect';

import {concatByAnd} from '../../../../../common/hammer/predicate';
import {COMPONENTS_NODES_TABLE_ID} from '../../../../../constants/components/nodes/nodes';
import {RootState} from '../../../../../store/reducers';
import {AttributesByProperty} from '../../../../../store/reducers/components/nodes/nodes/node';
import {getCluster} from '../../../../../store/selectors/global';
import {getSelectedColumns} from '../../../../../store/selectors/settings';
import {getMediumListNoCache} from '../../../../../store/selectors/thor';
import type {ValueOf} from '../../../../../types';
import {createMediumsPredicates} from '../../../../../utils/components/nodes/setup';
import {
    defaultColumns,
    getNodeTablesProps,
    PropertiesByColumn,
} from '../../../../../utils/components/nodes/tables';
import {
    getComponentNodesFilterPredicates,
    getComponentNodesFiltersSetup,
    getComponentNodesIndexByTag,
    getNodes,
    getPropertiesRequiredForFilters,
} from './predicates';

const getContentMode = (state: RootState) => state.components.nodes.nodes.contentMode;
const getHostFilter = (state: RootState) => state.components.nodes.nodes.hostFilter.toLowerCase();
const getSortState = (state: RootState) => state.tables[COMPONENTS_NODES_TABLE_ID];
export const getRequestIndex = (state: RootState) => state.components.nodes.nodes.index;

const getCustomColumns = (state: RootState) => getSelectedColumns(state) || defaultColumns;

const getMediumsPredicates = createSelector(
    [getComponentNodesFiltersSetup, getMediumListNoCache],
    createMediumsPredicates,
);

const getPropertiesRequiredForMediums = createSelector(
    [getMediumsPredicates],
    (mediumsPredicates) => (mediumsPredicates.length > 0 ? (['IOWeight'] as const) : []),
);

const getFilteredByHost = createSelector([getNodes, getHostFilter], (nodes, hostFilter) => {
    const hostFilters = hostFilter.split(/\s+/);
    return _.filter(nodes, (node) => {
        return _.some(hostFilters, (hostFilter) =>
            node?.host?.toLowerCase().startsWith(hostFilter),
        );
    });
});

const getFilteredNodes = createSelector(
    [getFilteredByHost, getComponentNodesFilterPredicates, getMediumsPredicates],
    (nodes, predicates, mediumsPredicates) => {
        const predicatesArray = predicates.concat(mediumsPredicates);
        if (!predicatesArray.length) {
            return nodes;
        }

        const predicate = concatByAnd(...predicatesArray);
        return _.filter(nodes, (node) => {
            return predicate(node);
        });
    },
);

export const getVisibleNodes = createSelector(
    [getFilteredNodes, getSortState, getMediumListNoCache, getCluster],
    (nodes, sortState, mediumList, cluster) => {
        return hammer.utils.sort(
            nodes.map((n) => ({...n, cluster})),
            sortState,
            getNodeTablesProps(mediumList).columns.items,
        );
    },
);

export const getComponentNodesTableProps = createSelector(
    [getMediumListNoCache],
    getNodeTablesProps,
);

const getVisibleColumns = createSelector(
    [getComponentNodesTableProps, getContentMode, getCustomColumns],
    (nodesTableProps, contentMode, customColumns) =>
        contentMode === 'custom' ? customColumns : nodesTableProps.columns.sets[contentMode].items,
);

const getPropertiesRequiredForRender = createSelector(
    [getVisibleColumns],
    (visibleColumns /* : Array<keyof typeof PropertiesByColumn> */) => {
        const requiredProperties = _.union(
            ...visibleColumns.map(
                (x) => (PropertiesByColumn as any)[x] as ValueOf<typeof PropertiesByColumn>,
            ),
        );

        return requiredProperties;
    },
);

export const getRequiredAttributes = createSelector(
    [
        getPropertiesRequiredForRender,
        getPropertiesRequiredForFilters,
        getPropertiesRequiredForMediums,
    ],
    (propertiesRequiredForRender, propertiesRequiredForFilters, propertiesRequiredForMediums) => {
        const allRequiredProperties = [
            ...propertiesRequiredForRender,
            ...propertiesRequiredForFilters,
            ...propertiesRequiredForMediums,
        ];

        const requiredAttributes = _.union(
            ...allRequiredProperties.map(
                (x) => (AttributesByProperty as any)[x] as ValueOf<typeof AttributesByProperty>,
            ),
        );

        return requiredAttributes;
    },
);

export const getShouldFetchTags = createSelector([getRequiredAttributes], (attributes) => {
    return attributes.indexOf('tags') < 0;
});

const getFetchedTags = (state: RootState): string[] => state.components.nodes.nodes.tags;

export const getComponentNodesTags = createSelector(
    [getShouldFetchTags, getFetchedTags, getComponentNodesIndexByTag],
    (shouldFetchTags, fetchedTags, map) => {
        if (shouldFetchTags) {
            return fetchedTags;
        }

        return _.keys(map).sort();
    },
);
