import React from 'react';
import {useUpdater} from '../../hooks/use-updater';
import {useDispatch, useSelector} from 'react-redux';
import {getCluster} from '../../store/selectors/global';
import {fetchSupportedFeatures} from '../../store/actions/global/supported-features';

function SupportedFeaturesUpdater() {
    const dispatch = useDispatch();
    const cluster = useSelector(getCluster);

    const updateFn = React.useCallback(() => {
        dispatch(fetchSupportedFeatures());
    }, [cluster, dispatch]);

    useUpdater(updateFn, 600000);

    return null;
}

export default React.memo(SupportedFeaturesUpdater);
