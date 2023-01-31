import {useSelector} from 'react-redux';
import React from 'react';
import cn from 'bem-cn-lite';

import CollapsibleSection from '../../../../../components/CollapsibleSection/CollapsibleSection';
import NodeCpuAndMemory, {
    hasCpuAndMemoryMeta,
} from '../../../../../pages/components/tabs/node/NodeCpuAndMemory/NodeCpuAndMemory';
import NodeResources, {
    hasResourcesMeta,
} from '../../../../../pages/components/tabs/node/NodeResources/NodeResources';
import NodeStorage, {
    hasStorageMeta,
} from '../../../../../pages/components/tabs/node/NodeStorage/NodeStorage';
import {nodeSelector} from '../../../../../store/selectors/components/node/node';

import './NodeGeneralTab.scss';

const block = cn('node-general');

function NodeGeneralTab(): ReturnType<React.VFC> {
    const {node} = useSelector(nodeSelector);

    if (!node) {
        return null;
    }

    return (
        <>
            {hasCpuAndMemoryMeta(node) && (
                <CollapsibleSection
                    size="s"
                    name="CPU and memory"
                    className={block('cpu')}
                    collapsed={false}
                >
                    <NodeCpuAndMemory {...{node}} />
                </CollapsibleSection>
            )}
            {hasStorageMeta(node) && (
                <CollapsibleSection
                    size="s"
                    name="Storage"
                    className={block('storage')}
                    collapsed={false}
                >
                    <NodeStorage {...node} />
                </CollapsibleSection>
            )}
            {hasResourcesMeta(node) && (
                <CollapsibleSection
                    size="s"
                    name="Resources"
                    className={block('resources')}
                    collapsed={false}
                >
                    <NodeResources {...node} />
                </CollapsibleSection>
            )}
        </>
    );
}

export default React.memo(NodeGeneralTab);
