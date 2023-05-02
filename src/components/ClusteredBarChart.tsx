'use client'

import * as am5 from '@amcharts/amcharts5'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5xy from '@amcharts/amcharts5/xy'
import { useEffect } from 'react'

import { vw } from '../common/utils'

type Props = {
  id: string
  data: Record<string, any>[]
  keyField: string
  valueFields: string[][]
}

export default function ClusteredBarChart({ id, data, keyField, valueFields }: Props) {
  useEffect(() => {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    const root = am5.Root.new(id)

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)])

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root.verticalLayout,
      })
    )

    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    )

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    const yRenderer = am5xy.AxisRendererY.new(root, {
      inversed: true,
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minGridDistance: 20,
    })

    yRenderer.labels.template.setAll({
      oversizedBehavior: 'wrap',
      maxWidth: Math.max(100, Math.min(vw(25), 250)),
      textAlign: 'center',
    })

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: keyField,
        renderer: yRenderer,
      })
    )

    yAxis.data.setAll(data)

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

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function createSeries(field: string, name: string) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: field,
          categoryYField: keyField,
          sequencedInterpolation: true,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: 'horizontal',
            labelText: '[bold]{name}[/]: {valueX}',
          }),
        })
      )

      series.columns.template.setAll({
        height: am5.p100,
        strokeOpacity: 0,
      })

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationX: 1,
          locationY: 0.5,
          sprite: am5.Label.new(root, {
            centerX: am5.p100,
            centerY: am5.p50,
            text: '{valueX}',
            fill: am5.color(0xffffff),
            populateText: true,
          }),
        })
      })

      series.columns.template.onPrivate('width', function (width, target) {
        am5.array.each(target?.dataItem?.bullets ?? [], (bullet) => {
          if ((width ?? 0) > bullet.get('sprite').width() + 1) {
            bullet.get('sprite').show()
          } else {
            bullet.get('sprite').hide()
          }
        })
      })

      series.data.setAll(data)
      series.appear()

      return series
    }

    for (const valueField of valueFields) {
      createSeries(valueField[0], valueField[1])
    }

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    )

    legend.data.setAll(chart.series.values)

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    const cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'zoomY',
      })
    )
    cursor.lineY.set('forceHidden', true)
    cursor.lineX.set('forceHidden', true)

    chart.root.dom.style.height = `${valueFields.length * data.length * 40 + 100}px`

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data, id, keyField, valueFields])

  return <div id={id} />
}
