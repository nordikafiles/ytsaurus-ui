import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import cn from 'bem-cn-lite';
import _ from 'lodash';

import {Info} from '../../../../components/Info/Info';
import {BundleParamsList} from './components/BundleParamsList/BundleParamsList';
import Dialog, {
    FormApi,
    FORM_ERROR,
    DialogError,
    DialogField,
    DialogTabField,
} from '../../../../components/Dialog/Dialog';
import hammer from '../../../../common/hammer';

import {isDeveloper} from '../../../../store/selectors/global';
import {
    hideTabletCellBundleEditor,
    setBundleEditorController,
} from '../../../../store/actions/tablet_cell_bundles/tablet-cell-bundle-editor';
import {getBundleEditorData} from '../../../../store/selectors/tablet_cell_bundles';
import {BundleResourceGuarantee} from '../../../../store/reducers/tablet_cell_bundles';
import {getTabletCellBundleEditorState} from '../../../../store/selectors/tablet_cell_bundles/tablet-cell-bundle-editor';

import {
    bundleEditorDict,
    createConfigurationList,
    createParams,
    getInitialFormValues,
    getResource,
    getResourceData,
    prepareSubmitBundle,
    simpleBundleValidate,
} from '../../../../utils/tablet_cell_bundles/bundles/bundle-editor-dialog';
import UIFactory, {isAbcAllowed} from '../../../../UIFactory';

import './BundleEditorDialog.scss';

const block = cn('bundle-editor');

export interface BundleEditorDialogFormValues {
    general?: {
        abc?: {slug: string; id?: number};
        changelog_account?: string;
        snapshot_account?: string;
    };
    resources?: {
        info?: string; // system
        rpc_proxy_count?: number; // todo
        rpc_proxy_resource_guarantee?: BundleResourceGuarantee;
        tablet_node_count?: number;
        tablet_node_resource_guarantee?: BundleResourceGuarantee;
        tablet_count?: number; // old
        tablet_static_memory?: number; // pld
    };
    memory_limits?: {
        error?: boolean; // system
        memory_reset: boolean; // system
        tablet_static?: number;
        tablet_dynamic?: number;
        compressed_block_cache?: number;
        uncompressed_block_cache?: number;
        versioned_chunk_meta?: number;
        lookup_row_cache?: number;
    };
    cpu_limits?: {
        threadPool_reset?: boolean; //system
        lookup_thread_pool_size?: number;
        query_thread_pool_size?: number;
        write_thread_pool_size?: number;
    };
}

export function BundleEditorDialog() {
    const {
        visibleEditor,
        bundleName,
        bundleData,
        data,
        bundleControllerData: orchidData,
    } = useSelector(getTabletCellBundleEditorState);
    const {defaultConfig: bundleDefaultConfig} = useSelector(getBundleEditorData);

    const bundleControllerConfig = bundleData?.bundle_controller_target_config;
    const enableBundleController = bundleData?.enable_bundle_controller || false;

    const {usage: tabletCountUsage} = getResourceData(data, 'tablet_count');
    const {usage: tabletStaticMemoryUsage} = getResourceData(data, 'tablet_static_memory');

    const allowEdit = useSelector(isDeveloper);

    const initialValues: BundleEditorDialogFormValues = (() => {
        if (!enableBundleController) {
            return getInitialFormValues(data);
        }
        if (!bundleControllerConfig) {
            return {};
        }
        return getInitialFormValues(data, bundleControllerConfig);
    })();

    const [rpcConfigurations, nodeConfigurations] = (() => {
        if (!bundleDefaultConfig) {
            return [[], []];
        }
        const {rpc_proxy_sizes, tablet_node_sizes} = bundleDefaultConfig;

        return [
            createConfigurationList(rpc_proxy_sizes),
            createConfigurationList(tablet_node_sizes),
        ];
    })();

    const renderGeneralTabs: DialogTabField<DialogField<BundleEditorDialogFormValues>> = {
        name: 'general',
        title: 'General',
        type: 'tab-vertical',
        size: 's',
        fields: [
            ...(!isAbcAllowed()
                ? []
                : [
                      {
                          name: 'abc',
                          type: 'abc-control' as const,
                          caption: 'ABC Service',
                          extras: {
                              placeholder: 'Select ABC service...',
                              disabled: !allowEdit,
                          },
                      },
                  ]),
            {
                name: 'changelog_account',
                type: 'accounts-suggest-with-loading',
                caption: 'Changelog_account account',
                extras: {
                    allowRootAccount: true,
                    disabled: !allowEdit,
                },
            },
            {
                name: 'snapshot_account',
                type: 'accounts-suggest-with-loading',
                caption: 'Snapshot_account account',
                extras: {
                    allowRootAccount: true,
                    disabled: !allowEdit,
                },
            },
        ],
    };

    const renderResourceTab: DialogTabField<DialogField<BundleEditorDialogFormValues>> = {
        name: 'resources',
        title: 'Resources',
        type: 'tab-vertical',
        size: 's',
        fields: [
            {
                name: 'info',
                type: 'block',
                extras: {
                    children: (
                        <Info className={block('info')}>
                            {UIFactory.renderTableCellBundleEditorNotice({bundleData})}
                            <BundleParamsList
                                className={block('params')}
                                params={[
                                    {
                                        title: 'Memory',
                                        value: hammer.format['Bytes'](
                                            orchidData?.resource_quota.memory || '0',
                                        ),
                                    },
                                    {
                                        title: 'vCPU',
                                        value: hammer.format['vCores'](
                                            orchidData?.resource_quota.vcpu || '0',
                                        ),
                                    },
                                ]}
                            />
                        </Info>
                    ),
                },
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'tablet_count',
                type: 'bundle-input',
                extras: {
                    title: 'Tablet count',
                    format: 'Number',
                    withoutDetailedBar: true,
                    progress: {
                        usage: tabletCountUsage,
                    },
                },
                validator: simpleBundleValidate,
            },
            {section: 'RPC proxy'},
            {
                className: block('dialog-field-without-default-label'),
                type: 'bundle-input',
                name: 'rpc_proxy_count',
                extras: {
                    title: 'Rpc proxy count',
                    format: 'Number',
                    withoutDetailedBar: true,
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-with-transfer-to-another-line'),
                type: 'bundle-table-field',
                name: 'rpc_proxy_resource_guarantee',
                caption: 'Instance configuration',
                extras: {
                    data: rpcConfigurations,
                },
            },
            {section: 'Tablet node'},
            {
                className: block('dialog-field-without-default-label'),
                type: 'bundle-input',
                name: 'tablet_node_count',
                extras: {
                    title: 'Tablet node count',
                    format: 'Number',
                    withoutDetailedBar: true,
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-with-transfer-to-another-line'),
                type: 'bundle-table-field',
                name: 'tablet_node_resource_guarantee',
                caption: 'Instance configuration',
                extras: function (values, form) {
                    const onRadioClick = (value: BundleResourceGuarantee) => {
                        const nodeConfigurationType = value.type || '';

                        const defaultMemory =
                            bundleDefaultConfig?.tablet_node_sizes[nodeConfigurationType]
                                .default_config.memory_limits || {};
                        const defaultThreadPool =
                            bundleDefaultConfig?.tablet_node_sizes[nodeConfigurationType]
                                .default_config.cpu_limits || {};

                        const resultMemory = getResource(
                            values.memory_limits,
                            defaultMemory,
                            'memory_limits',
                        );
                        const resultThreadPool = getResource(
                            values.cpu_limits,
                            defaultThreadPool,
                            'cpu_limits',
                        );

                        form.change('memory_limits', {
                            ...bundleEditorDict.defaults.memory_limits,
                            ...resultMemory,
                        });
                        form.change('cpu_limits', {
                            ...bundleEditorDict.defaults.cpu_limits,
                            ...resultThreadPool,
                        });
                    };

                    return {
                        data: nodeConfigurations,
                        onRadioClick,
                    };
                },
            },
        ],
    };

    const renderSimpleResourceTab: DialogTabField<DialogField<BundleEditorDialogFormValues>> = {
        name: 'resources',
        title: 'Resources',
        type: 'tab-vertical',
        size: 's',
        fields: [
            {
                className: block('dialog-field-without-default-label'),
                name: 'tablet_count',
                type: 'bundle-input',
                extras: {
                    title: 'Tablet count',
                    format: 'Number',
                    withoutDetailedBar: true,
                    progress: {
                        usage: tabletCountUsage,
                    },
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'tablet_static_memory',
                type: 'bundle-input',
                extras: {
                    title: 'Tablet static memory',
                    format: 'Bytes',
                    progress: {
                        usage: tabletStaticMemoryUsage,
                    },
                },
                validator: simpleBundleValidate,
            },
        ],
    };

    const renderMemoryTab: DialogTabField<DialogField<BundleEditorDialogFormValues>> = {
        name: 'memory_limits',
        title: 'Memory',
        type: 'tab-vertical',
        size: 's',
        visibilityCondition: {
            when: 'resources.tablet_node_resource_guarantee',
            isActive: (v) => typeof v !== 'undefined',
        },
        fields: [
            {
                name: 'memory_reset',
                type: 'bundle-title',
                className: block('dialog-field-without-default-label'),
                extras: (allValues, form) => {
                    const tablet_node_resource_guarantee =
                        allValues.resources?.tablet_node_resource_guarantee;

                    const onReset = () => {
                        if (
                            !tablet_node_resource_guarantee ||
                            !tablet_node_resource_guarantee.type ||
                            !bundleDefaultConfig
                        ) {
                            return;
                        }
                        const type = tablet_node_resource_guarantee.type;
                        const {tablet_node_sizes} = bundleDefaultConfig;
                        const {memory_limits} = tablet_node_sizes[type].default_config;

                        form.change('memory_limits', {
                            ...bundleEditorDict.defaults.memory_limits,
                            ...memory_limits,
                        });
                    };

                    if (!tablet_node_resource_guarantee) {
                        return {
                            params: [],
                            title: 'Memory',
                            onReset,
                        };
                    }
                    const {memory} = tablet_node_resource_guarantee;

                    const used = bundleEditorDict.keys.memory_limits.reduce((sum, k) => {
                        return sum + (allValues?.memory_limits?.[k] || 0);
                    }, 0);

                    return {
                        params: createParams('Bytes', memory, used),
                        title: 'Memory',
                        onReset,
                    };
                },
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'tablet_static',
                type: 'bundle-input',
                extras: {
                    title: 'Tablet static',
                    format: 'Bytes',
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'tablet_dynamic',
                type: 'bundle-input',
                extras: {
                    title: 'Tablet dynamic',
                    format: 'Bytes',
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'compressed_block_cache',
                type: 'bundle-input',
                extras: {
                    title: 'Compressed block cache',
                    format: 'Bytes',
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'uncompressed_block_cache',
                type: 'bundle-input',
                extras: {
                    title: 'Uncompressed block cache',
                    format: 'Bytes',
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'versioned_chunk_meta',
                type: 'bundle-input',
                extras: {
                    title: 'Versioned chunk meta',
                    format: 'Bytes',
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'lookup_row_cache',
                type: 'bundle-input',
                extras: {
                    title: 'Lookup row cache',
                    format: 'Bytes',
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                type: 'block',
                name: 'error',
                validator: (v: any) => (v ? v : undefined),
                extras(allValues, form) {
                    const hasError = _.get(allValues, 'memory_limits.error');
                    const errorText = validateMemoryLimits(allValues);

                    if (errorText && !hasError) {
                        form.change('memory_limits.error', true);
                    } else if (!errorText && hasError) {
                        form.change('memory_limits.error', false);
                    }

                    return {
                        children: !errorText ? null : (
                            <DialogError header={'Error'} message={<span>{errorText}</span>} />
                        ),
                    };
                },
            },
        ],
    };

    const renderThreadPoolTab: DialogTabField<DialogField<BundleEditorDialogFormValues>> = {
        name: 'cpu_limits',
        title: 'Thread pool',
        type: 'tab-vertical',
        size: 's',
        visibilityCondition: {
            when: 'resources.tablet_node_resource_guarantee',
            isActive: (v) => typeof v !== 'undefined',
        },
        fields: [
            {
                name: 'threadPool_reset',
                type: 'bundle-title',
                className: block('dialog-field-without-default-label'),
                extras: (allValues, form) => {
                    const tablet_node_resource_guarantee =
                        allValues.resources?.tablet_node_resource_guarantee;

                    if (
                        !tablet_node_resource_guarantee ||
                        !tablet_node_resource_guarantee.type ||
                        !bundleDefaultConfig
                    ) {
                        return {
                            params: [],
                            title: 'vCPU',
                            onReset: () => {},
                        };
                    }

                    const onReset = () => {
                        const type = tablet_node_resource_guarantee.type;
                        if (!type) {
                            return;
                        }

                        const {tablet_node_sizes} = bundleDefaultConfig;
                        const {cpu_limits} = tablet_node_sizes[type].default_config;

                        form.change('cpu_limits', {
                            ...bundleEditorDict.defaults.cpu_limits,
                            ...cpu_limits,
                        });
                    };

                    const {vcpu} = tablet_node_resource_guarantee;

                    return {
                        params: createParams('vCores', vcpu),
                        title: 'vCPU',
                        onReset,
                    };
                },
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'lookup_thread_pool_size',
                type: 'bundle-input',
                extras: {
                    title: 'Lookup thread pool size',
                    postfix: 'threads',
                    format: 'Number',
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'query_thread_pool_size',
                type: 'bundle-input',
                extras: {
                    title: 'Query thread pool size',
                    postfix: 'threads',
                    format: 'Number',
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
            {
                className: block('dialog-field-without-default-label'),
                name: 'write_thread_pool_size',
                type: 'bundle-input',
                extras: {
                    title: 'Write thread pool size',
                    postfix: 'threads',
                    format: 'Number',
                    hasClear: true,
                },
                validator: simpleBundleValidate,
            },
        ],
    };

    const fields = [renderGeneralTabs];
    if (enableBundleController) {
        fields.push(renderResourceTab, renderMemoryTab, renderThreadPoolTab);
    } else {
        fields.push(renderSimpleResourceTab);
    }

    const dispatch = useDispatch();
    const onClose = () => {
        dispatch(hideTabletCellBundleEditor());
    };

    const onSubmit = async (form: FormApi<BundleEditorDialogFormValues>) => {
        if (!bundleName) {
            return {};
        }

        const preparedData = prepareSubmitBundle(form);

        try {
            await dispatch(
                setBundleEditorController({
                    bundleName,
                    data: preparedData,
                }),
            );
            return undefined;
        } catch (error) {
            return {
                validationErrors: {
                    [FORM_ERROR]: <DialogError error={error} />,
                },
            };
        }
    };

    if (_.isEmpty(data)) {
        return null;
    }

    return (
        <Dialog<BundleEditorDialogFormValues>
            className={block('dialog')}
            headerProps={{
                title: bundleName,
            }}
            size="l"
            initialValues={initialValues}
            visible={visibleEditor}
            onAdd={onSubmit}
            onClose={onClose}
            fields={fields}
        />
    );
}

function validateMemoryLimits(values: BundleEditorDialogFormValues) {
    if (values.resources?.tablet_node_resource_guarantee) {
        const memoryLimits = values.resources.tablet_node_resource_guarantee?.memory || 0;
        const currentAccLimit =
            Object.values(values.memory_limits || {}).reduce((acc: number, v: number | boolean) => {
                if (typeof v !== 'number') {
                    return acc;
                }
                return acc + v;
            }, 0) || 0;

        if (currentAccLimit > memoryLimits) {
            return 'The sum of the memory limits exceeds the allowed values';
        }
    }

    return '';
}
