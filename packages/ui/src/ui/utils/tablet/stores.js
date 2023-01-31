import ypath from '@ytsaurus/interface-helpers/lib/ypath';
import _ from 'lodash';

import Store from '../../utils/tablet/store';

export function prepareRelativePath(partitionIndex, storeId) {
    return (
        (partitionIndex === -1 ? '/eden' : '/partitions/' + partitionIndex) +
        '/stores' +
        (typeof storeId !== 'undefined' ? '/' + storeId : '')
    );
}

export function preparePath(tabletPath, partitionIndex, storeId) {
    return tabletPath + prepareRelativePath(partitionIndex, storeId);
}

export function prepareStores(stores, storesId) {
    return _.map(
        stores,
        (store, index) =>
            new Store({
                $value: storesId[index],
                $attributes: ypath.getValue(stores[index], ''),
            }),
    );
}
