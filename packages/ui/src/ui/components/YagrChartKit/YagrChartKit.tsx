import ChartKit, {settings} from '@gravity-ui/chartkit';
import {YagrPlugin} from '@gravity-ui/chartkit/build/plugins';
export type {YagrWidgetData} from '@gravity-ui/chartkit/build/plugins';

import '@gravity-ui/yagr/dist/index.css';

settings.set({plugins: [YagrPlugin]});

const COLORS = ['rgb(77, 162, 241)', 'rgb(255, 61, 100)'];

export function getSerieColor(serieIndex: number) {
    return COLORS[serieIndex % COLORS.length];
}

export default ChartKit;
