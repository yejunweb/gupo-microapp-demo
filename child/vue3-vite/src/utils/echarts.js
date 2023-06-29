import * as echarts from 'echarts/core';
import { BarChart, LineChart, RadarChart, PieChart, GaugeChart, TreemapChart, HeatmapChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    DatasetComponent,
    TransformComponent,
    ToolboxComponent,
    VisualMapComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    DatasetComponent,
    TransformComponent,
    ToolboxComponent,
    VisualMapComponent,
    BarChart,
    LineChart,
    RadarChart,
    PieChart,
    GaugeChart,
    TreemapChart,
    HeatmapChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
]);

export default echarts;
