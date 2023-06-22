/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {RangeInputPicker} from '../../../../../components/common/RangeInputPicker';
import Button from '../../../../../components/Button/Button';
import Filter from '../../../../../components/Filter/Filter';
import Icon from '../../../../../components/Icon/Icon';
import OffsetSelectorButton from '../../../../../pages/navigation/content/Table/TableOverview/OffsetSelectorButton';

import {
    getOffsetValue,
    getProgressWidth,
    getRowCount,
} from '../../../../../store/selectors/navigation/content/table';
import {getIsDynamic} from '../../../../../store/selectors/navigation/content/table-ts';
import {moveOffset} from '../../../../../store/actions/navigation/content/table/pagination';

import './TableOverview.scss';

TableOverview.propTypes = {
    // from parent
    block: PropTypes.func.isRequired,

    // from connect
    isDynamic: PropTypes.bool.isRequired,
    rowCount: PropTypes.number.isRequired,
    progressWidth: PropTypes.string.isRequired,
    offsetValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    moveOffset: PropTypes.func.isRequired,
};

const renderInput = (props, handleEndEditing) => {
    const {offsetValue, rowCount, isDynamic} = props;

    return isDynamic ? (
        <Filter
            iconLeft={<Icon awesome="key" />}
            onBlur={handleEndEditing}
            value={offsetValue}
            placeholder=""
            size="m"
        />
    ) : (
        <RangeInputPicker
            iconLeft={<Icon awesome="hashtag" />}
            onOutsideClick={handleEndEditing}
            onAfterUpdate={handleEndEditing}
            onSubmit={handleEndEditing}
            maxValue={rowCount - 1}
            infoPointsCount={0}
            value={offsetValue}
            autoFocus
            size="s"
        />
    );
};

const renderPlaceholder = (props, handleStartEditing) => {
    const {block, isDynamic, offsetValue, progressWidth: width} = props;

    return (
        <div className={block('query-current')} onClick={handleStartEditing}>
            <Icon awesome={isDynamic ? 'key' : 'hashtag'} />
            {offsetValue || 'No offset'}
            {!isDynamic && <div className={block('query-progress')} style={{width}} />}
        </div>
    );
};

function TableOverview(props) {
    const {block, moveOffset, isDynamic} = props;
    const [editing, changeEditing] = useState(false);

    const handleEndEditing = (value) => {
        changeEditing(false);
        moveOffset(value);
    };
    const handleStartEditing = () => {
        changeEditing(true);
    };

    return (
        <div className={block('input', {edit: editing, dynamic: isDynamic})}>
            {isDynamic && <OffsetSelectorButton disabled={editing} />}
            {editing
                ? renderInput(props, handleEndEditing)
                : renderPlaceholder(props, handleStartEditing)}
            {isDynamic && (
                <Button
                    size="m"
                    view="action"
                    title="Confirm"
                    pin="clear-round"
                    disabled={!editing}
                >
                    Confirm
                </Button>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    const progressWidth = getProgressWidth(state);
    const offsetValue = getOffsetValue(state);
    const isDynamic = getIsDynamic(state);
    const rowCount = getRowCount(state);

    return {progressWidth, offsetValue, rowCount, isDynamic};
};

const mapDispatchToProps = {
    moveOffset,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableOverview);
