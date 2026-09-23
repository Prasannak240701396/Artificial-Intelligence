import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ReactEChartProps {
  option: echarts.EChartsOption;
  height?: string;
  className?: string;
}

export const ReactEChart: React.FC<ReactEChartProps> = ({ option, height = '300px', className = '' }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current, 'dark', {
        renderer: 'canvas',
      });
    }

    const mergedOption: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: 'monospace',
        color: '#94a3b8',
      },
      grid: {
        top: 30,
        right: 20,
        bottom: 30,
        left: 20,
        containLabel: true,
      },
      ...option,
    };

    chartInstanceRef.current.setOption(mergedOption, true);

    // Initial resize to ensure chart renders in flex/grid containers
    requestAnimationFrame(() => {
      chartInstanceRef.current?.resize();
    });
  }, [option]);

  // ResizeObserver for reliable container size tracking
  useEffect(() => {
    if (!chartRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height, minHeight: height, minWidth: '100%' }}
      className={`w-full overflow-hidden ${className}`}
    />
  );
};
