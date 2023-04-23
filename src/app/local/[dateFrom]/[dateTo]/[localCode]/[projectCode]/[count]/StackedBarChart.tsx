'use client'

import * as am5 from '@amcharts/amcharts5'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5xy from '@amcharts/amcharts5/xy'
import { useEffect } from 'react'

type Props = {
  data: any
}

export default function StackedBarChart({ data }: Props) {
  useEffect(() => {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    const root = am5.Root.new('StackedBarChart')

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    const myTheme = am5.Theme.new(root)

    myTheme.rule('Grid', ['base']).setAll({
      strokeOpacity: 0.1,
    })

    root.setThemes([am5themes_Animated.new(root), myTheme])

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        wheelX: 'zoomY',
        wheelY: 'panY',
        layout: root.verticalLayout,
      })
    )

    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    )

    // Data
    const data2 = data
      .map((d: any) => {
        const result: any = {
          detailBusinessName: d.detailBusinessName,
        }
        if (+d.budgetSum > 0) result['budgetSum'] = Math.floor(+d.budgetSum / 1_000_000)
        if (+d.nxndrSum > 0) result['nxndrSum'] = Math.floor(+d.nxndrSum / 1_000_000)
        if (+d.citySum > 0) result['citySum'] = Math.floor(+d.citySum / 1_000_000)
        if (+d.sigunguSum > 0) result['sigunguSum'] = Math.floor(+d.sigunguSum / 1_000_000)
        if (+d.etcSum > 0) result['etcSum'] = Math.floor(+d.etcSum / 1_000_000)
        return result
      })
      .reverse()

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    const yRenderer = am5xy.AxisRendererY.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minGridDistance: 20,
    })

    yRenderer.labels.template.setAll({
      oversizedBehavior: 'truncate', // You can replace it with "truncate".
      maxWidth: 200,
      textAlign: 'right',
      tooltipText: '{category}',
    })

    yRenderer.grid.template.setAll({
      location: 1,
    })

    const tooltip = am5.Tooltip.new(root, { pointerOrientation: 'down' })

    tooltip.label.setAll({
      oversizedBehavior: 'wrap',
      maxWidth: 180,
      textAlign: 'center',
    })

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'detailBusinessName',
        maxDeviation: 0,
        renderer: yRenderer,
        tooltip: tooltip,
      })
    )

    yAxis.data.setAll(data2)

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
        }),
        strictMinMaxSelection: true,
      })
    )

    chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
        xAxis: xAxis,
        yAxis: yAxis,
      })
    )

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    )

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name: string, fieldName: string) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXField: fieldName,
          categoryYField: 'detailBusinessName',
        })
      )

      series.columns.template.setAll({
        tooltipText: '{name}: {valueX}',
        tooltipY: am5.percent(90),
      })

      series.data.setAll(data2)

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear()

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: '{valueX}',
            fill: root.interfaceColors.get('alternativeText'),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        })
      )

      series.columns.template.onPrivate('width', function (width, target) {
        am5.array.each(target?.dataItem?.bullets ?? [], (bullet) => {
          if ((width ?? 0) > bullet.get('sprite').width() + 1) {
            bullet.get('sprite').show()
          } else {
            bullet.get('sprite').hide()
          }
        })
      })

      legend.data.push(series)
    }

    makeSeries('국비', 'nxndrSum')
    makeSeries('시도비', 'citySum')
    makeSeries('시군구비', 'sigunguSum')
    makeSeries('기타', 'etcSum')

    // // Set it on chart's container
    chart.root.dom.style.height = `${data.length * 50 + 150}px`

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data])

  return <div id="StackedBarChart" />
}
