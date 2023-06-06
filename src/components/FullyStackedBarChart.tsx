'use client'

import * as am5 from '@amcharts/amcharts5'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5xy from '@amcharts/amcharts5/xy'
import { useEffect } from 'react'

import { vw } from '../common/utils'

type Props = {
  data: any
  id: string
  keyField: string
}

export default function FullyStackedBarChart({ data, id, keyField }: Props) {
  useEffect(() => {
    let root = am5.Root.new(id)

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    let myTheme = am5.Theme.new(root)

    myTheme.rule('Grid', ['base']).setAll({
      strokeOpacity: 0.1,
    })

    root.setThemes([am5themes_Animated.new(root), myTheme])

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root.verticalLayout,
      })
    )

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
      'scrollbarY',
      am5.Scrollbar.new(root, {
        orientation: 'vertical',
      })
    )

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let yRenderer = am5xy.AxisRendererY.new(root, {})
    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: keyField,
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    )

    yRenderer.grid.template.setAll({
      location: 1,
    })

    yAxis.data.setAll(data)

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        maxDeviation: 0,
        numberFormat: "#'%'",
        strictMinMax: true,
        calculateTotals: true,
        renderer: am5xy.AxisRendererX.new(root, {
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
          baseAxis: yAxis,
          valueXField: fieldName,
          valueXShow: 'valueXTotalPercent',
          categoryYField: keyField,
        })
      )

      series.columns.template.setAll({
        tooltipText: "{name}: {valueX} ({valueXTotalPercent.formatNumber('#.#')}%)",
        tooltipY: am5.percent(90),
      })
      series.data.setAll(data)

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear()

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueXTotalPercent.formatNumber('#.#')}%",
            fill: root.interfaceColors.get('alternativeText'),
            centerY: am5.p50,
            centerX: am5.p50,
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

      legend.data.push(series)
    }

    const fieldNames = new Set<string>()

    for (const d of data) {
      for (const fieldName of Object.keys(d)) {
        if (fieldName === keyField) continue
        fieldNames.add(fieldName)
      }
    }

    for (const fieldName of fieldNames) {
      makeSeries(fieldName, fieldName)
    }

    chart.root.dom.style.height = `${data.length * 50 + 50 + getHeight(fieldNames.size) * 40}px`

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data, id, keyField])

  return <div id={id} />
}

function getHeight(size: number) {
  const viewWidth = vw()
  if (viewWidth < 440) return size
  else if (viewWidth >= 440 && viewWidth < 610) return size / 2
  else if (viewWidth >= 610 && viewWidth < 820) return size / 3
  else return size / 4
}
