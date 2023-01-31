import React from 'react';
import cn from 'bem-cn-lite';

import Icon from '../../components/Icon/Icon';
import {nextSortOrderValue, OrderType} from '../../utils/sort-helpers';

import './SortIcon.scss';

const block = cn('sort-icon');

const ICON_BY_TYPE = {
    ['']: 'sort',
    asc: 'sort-up',
    desc: 'sort-down',
    'asc-undefined': 'arrow-to-bottom',
    'desc-undefined': 'arrow-from-bottom',
    'undefined-asc': 'arrow-from-top',
    'undefined-desc': 'arrow-to-top',
} as const;

interface Props {
    className?: string;
    label?: string;
    onChange?: (nextOrder: OrderType) => void;
    order?: OrderType;
    hidden?: boolean;
    allowUnordered?: boolean;
    withUndefined?: boolean;
}

export default class SortIcon extends React.Component<Props> {
    onClick = () => {
        const {order, onChange, allowUnordered, withUndefined} = this.props;
        if (!onChange) {
            return;
        }

        const nextOrder = nextSortOrderValue(order, allowUnordered, withUndefined);
        onChange(nextOrder);
    };

    render() {
        const {className, label, order, hidden} = this.props;
        const icon = ICON_BY_TYPE[order || ''];

        return (
            <span className={block({hidden}, className)} onClick={this.onClick}>
                {label && <span className={block('label')}>{label}</span>}
                <span className={block('icon')}>
                    <Icon awesome={icon} face="solid" />
                </span>
            </span>
        );
    }
}
