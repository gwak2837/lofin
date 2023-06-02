'use client'

import * as am5 from '@amcharts/amcharts5'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5xy from '@amcharts/amcharts5/xy'
import { useEffect } from 'react'

type Props = {
  data: any
  id: string
  keyField: string
  valueFields: string[]
}

export default function StackedColumnChart({ data, id, keyField, valueFields }: Props) {
  useEffect(() => {
    let root = am5.Root.new(id)
    root.setThemes([am5themes_Animated.new(root)])

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root.verticalLayout,
      })
    )

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    )

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(root, {})
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: keyField,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    )

    xRenderer.grid.template.setAll({
      location: 1,
    })

    xAxis.data.setAll(data)

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    )

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    )

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name: string, fieldName: string) {
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: keyField,
        })
      )

      series.columns.template.setAll({
        tooltipText: '{name}: {valueY}',
        tooltipY: am5.percent(10),
      })
      series.data.setAll(data)

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear()

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: '{valueY}',
            fill: root.interfaceColors.get('alternativeText'),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        })
      })

      series.columns.template.onPrivate('height', function (height, target) {
        am5.array.each(target?.dataItem?.bullets ?? [], (bullet) => {
          if ((height ?? 0) > bullet.get('sprite').height() + 1) {
            bullet.get('sprite').show()
          } else {
            bullet.get('sprite').hide()
          }
        })
      })

      legend.data.push(series)
    }

    for (const valueField of valueFields) {
      makeSeries(valueField, valueField)
    }

    chart.root.dom.style.height = `100vh`
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data, id, keyField, valueFields])

  return <div id={id} />
}
