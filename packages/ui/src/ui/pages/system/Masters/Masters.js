import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {compose} from 'redux';
import _ from 'lodash';

import {CollapsibleSectionStateLess} from '../../../components/CollapsibleSection/CollapsibleSection';
import VisibleHostTypeRadioButton from '../../../pages/system/VisibleHostTypeRadioButton';
import {sortStateProgress} from '../../../utils';
import SystemStateOverview from '../SystemStateOverview/SystemStateOverview';
import withDataLoader from '../../../hocs/pages/withDataLoader';
import MasterGroup from './MasterGroup';

import {cancelLoadMasters, loadMasters} from '../../../store/actions/system/masters';
import {getUISizes} from '../../../store/selectors/global';
import {setSettingsSystemMastersCollapsed} from '../../../store/actions/settings/settings';

import './Masters.scss';
import {getSettingsSystemMastersCollapsed} from '../../../store/selectors/settings-ts';

const b = block('system-master');
const headingCN = block('elements-heading')({size: 's'});

function computeStateProgress(counters) {
    const total = counters.total;

    return sortStateProgress(
        _.map(counters.states, (count, state) => {
            return {
                value: total && (count / total) * 100,
                title: 'State: ' + state,
                theme:
                    {
                        quorum: 'success',
                        'weak-quorum': 'warning',
                        'no-quorum': 'danger',
                    }[state] || 'default',
            };
        }),
    );
}

class Masters extends Component {
    static propTypes = {
        // from connect
        counters: PropTypes.shape({
            flags: PropTypes.object,
            states: PropTypes.object,
        }).isRequired,
        initialized: PropTypes.bool.isRequired,
        primary: PropTypes.shape(MasterGroup.propTypes).isRequired,
        secondary: PropTypes.arrayOf(PropTypes.shape(MasterGroup.propTypes)),
        providers: PropTypes.shape(MasterGroup.propTypes).isRequired,
        discovery: PropTypes.shape(MasterGroup.propTypes).isRequired,
    };

    onToggle = () => {
        const {setSettingsSystemMastersCollapsed, collapsed: prevCollapsed} = this.props;
        setSettingsSystemMastersCollapsed(!prevCollapsed);
    };

    mastersFitIntoSection() {
        const {secondary, providers, discovery, queueAgents} = this.props;

        let groupsCount = 1; // for primary masters;
        groupsCount += secondary?.length || 0;
        groupsCount += providers?.instances?.length ? 1 : 0;
        groupsCount += discovery?.instances?.length ? 1 : 0;
        groupsCount += queueAgents?.instances?.length ? 1 : 0;

        return groupsCount <= 3;
    }

    renderMastersGroups = (masters, gridRowStart, {allowVoting} = {allowVoting: false}) =>
        _.map(masters, (master) => (
            <MasterGroup
                key={master.cellTag}
                {...master}
                gridRowStart={gridRowStart}
                allowVoting={allowVoting}
            />
        ));

    renderMasterTypeSwitcher() {
        return <VisibleHostTypeRadioButton className={b('container-host-radio')} />;
    }

    renderContent() {
        const {primary, secondary, providers, discovery, queueAgents} = this.props;

        const fitIntoSection = this.mastersFitIntoSection();

        const secondaryGroups = this.renderMastersGroups(secondary, fitIntoSection, {
            allowVoting: true,
        });

        return fitIntoSection ? (
            <div className={b('all-masters')}>
                <div className={headingCN}>
                    Primary Masters
                    {this.renderMasterTypeSwitcher()}
                </div>
                <MasterGroup className={b('primary-master')} {...primary} allowVoting />
                {Boolean(secondary?.length) && (
                    <React.Fragment>
                        <div className={headingCN}>Secondary Masters</div>
                        {secondaryGroups}
                    </React.Fragment>
                )}
                {Boolean(providers?.instances?.length) && (
                    <React.Fragment>
                        <div className={headingCN}>
                            Timestamp providers
                            {this.renderMasterTypeSwitcher()}
                        </div>
                        <MasterGroup
                            {...providers}
                            className={b('timestamp-providers')}
                            gridRowStart
                            allowVoting
                        />
                    </React.Fragment>
                )}
                {Boolean(discovery?.instances?.length) && (
                    <React.Fragment>
                        <div className={headingCN}>
                            Discovery servers
                            {this.renderMasterTypeSwitcher()}
                        </div>
                        <MasterGroup
                            {...discovery}
                            className={b('discovery-servers')}
                            gridRowStart
                        />
                    </React.Fragment>
                )}
                {Boolean(queueAgents?.instances?.length) && (
                    <React.Fragment>
                        <div className={headingCN}>
                            Queue agents
                            {this.renderMasterTypeSwitcher()}
                        </div>
                        <MasterGroup {...queueAgents} />
                    </React.Fragment>
                )}
            </div>
        ) : (
            <div>
                <div className={headingCN}>
                    Primary Masters
                    {this.renderMasterTypeSwitcher()}
                </div>
                <MasterGroup className={b('primary-master')} {...primary} allowVoting />
                {Boolean(secondary?.length) && (
                    <React.Fragment>
                        <div className={headingCN}>Secondary Masters</div>
                        <div className={b('secondary-masters')}>{secondaryGroups}</div>
                    </React.Fragment>
                )}

                <div className={b('flex')}>
                    {Boolean(providers?.instances?.length) &&
                        this.renderSection('providers', 'Timestamp providers', providers, {
                            allowVoting: true,
                        })}
                    {Boolean(discovery?.instances?.length) &&
                        this.renderSection('discovery', 'Discovery servers', discovery)}
                    {Boolean(queueAgents?.length) &&
                        this.renderSection('queueAgents', 'Queue agents', queueAgents)}
                </div>
            </div>
        );
    }

    renderSection(name, heading, data, {allowVoting} = {allowVoting: false}) {
        return (
            <div className={b(name)}>
                <div className={headingCN}>{heading}</div>
                <div className={b(`${name}-hosts`)}>
                    <MasterGroup {...data} allowVoting={allowVoting} />
                </div>
            </div>
        );
    }

    renderOverview() {
        const {counters} = this.props;

        const stateOverview = counters && {
            value: 100,
            view: 'thin',
            stack: computeStateProgress(counters),
        };
        const stateThemeMappings = {
            unavailable: 'danger',
            recovery: 'warning',
            'no-quorum': 'danger',
            'weak-quorum': 'warning',
        };
        const counterGroups = [
            ['recovery', 'unavailable'],
            ['primary', 'secondary'],
            ['no-quorum', 'weak-quorum', 'quorum'],
        ];

        return (
            <SystemStateOverview
                tab="masters"
                counters={counters}
                stateThemeMappings={stateThemeMappings}
                stateOverview={stateOverview}
                counterGroup={counterGroups}
            />
        );
    }

    render() {
        const {initialized, collapsibleSize, collapsed} = this.props;

        if (!initialized) {
            return null;
        }

        const content = this.renderContent();
        const overview = this.renderOverview();

        return (
            <CollapsibleSectionStateLess
                name={'Masters'}
                overview={overview}
                collapsed={collapsed}
                onToggle={this.onToggle}
                size={collapsibleSize}
            >
                {content}
            </CollapsibleSectionStateLess>
        );
    }
}

function mapStateToProps(state) {
    const {secondary, primary, providers, discovery, queueAgents, counters, initialized} =
        state.system.masters;
    return {
        initialized,
        secondary,
        primary,
        providers,
        discovery,
        queueAgents,
        counters,
        collapsibleSize: getUISizes(state).collapsibleSize,
        collapsed: getSettingsSystemMastersCollapsed(state),
    };
}

const mapDispatchToProps = {
    loadData: loadMasters,
    cancelLoadData: cancelLoadMasters,
    setSettingsSystemMastersCollapsed,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withDataLoader)(Masters);
