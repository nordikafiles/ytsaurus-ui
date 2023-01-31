import {TabsItemProps} from '@gravity-ui/uikit';
import {times} from 'lodash';
import {QueryItem, QueryStatus} from '../../module/api';
import {useCallback, useEffect, useMemo, useState} from 'react';

export enum QueryResultTab {
    ERROR = 'error',
    META = 'meta',
    RESULT = 'result',
    STATISTIC = 'statistic',
}

const isResultTab = (tabId: string) => tabId.startsWith('result/');

const createResultTabId = (index: number) => `result/${index}`;

const parseResultTabIndex = (tabId: string) => {
    const parts = tabId.split('/');
    return parts?.[1] ? parseInt(parts?.[1], 10) : undefined;
};

type ResultCurrentState = {
    activeTabId: string;
    category: QueryResultTab;
    resultIndex?: number;
};

export const useQueryResultTabs = (
    query?: QueryItem,
): [TabsItemProps[], (tab: string) => void, ResultCurrentState] => {
    const [tab, setTab] = useState<QueryResultTab>(QueryResultTab.META);
    const [resultIndex, setActiveIndex] = useState<number | undefined>(undefined);

    const activeTabId = useMemo(() => {
        if (tab === QueryResultTab.RESULT) {
            return createResultTabId(resultIndex || 0);
        }
        return tab;
    }, [tab, resultIndex]);

    const setActiveTab = useCallback(
        (tab: string) => {
            if (isResultTab(tab)) {
                setTab(QueryResultTab.RESULT);
                setActiveIndex(parseResultTabIndex(tab));
            } else {
                setTab(tab as QueryResultTab);
                setActiveIndex(undefined);
            }
        },
        [setTab],
    );

    const tabs = useMemo(() => {
        if (!query) {
            return [];
        }
        const items: TabsItemProps[] = [{id: QueryResultTab.META, title: 'Meta'}];
        if (query.state === QueryStatus.FAILED) {
            items.unshift({id: QueryResultTab.ERROR, title: 'Error'});
        } else if (query.state === QueryStatus.COMPLETED) {
            if (query.progress?.yql_statistics) {
                items.unshift({
                    id: QueryResultTab.STATISTIC,
                    title: 'Statistics',
                });
            }
            items.unshift(
                ...times(query.result_count, (num) => ({
                    id: createResultTabId(num),
                    title: query.result_count === 1 ? 'Result' : `Result #${num + 1}`,
                })),
            );
        }
        return items;
    }, [query]);

    useEffect(() => {
        setActiveTab(tabs?.[0]?.id);
    }, [query]);

    return [
        tabs,
        setActiveTab,
        {
            activeTabId,
            category: tab,
            resultIndex,
        },
    ];
};
