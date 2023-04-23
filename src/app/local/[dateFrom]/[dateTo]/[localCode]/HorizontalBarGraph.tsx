'use client'

import * as am5 from '@amcharts/amcharts5'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5xy from '@amcharts/amcharts5/xy'
import { useEffect } from 'react'

type Props = {
  data: any
}

export default function HorizontalBarGraph({ data }: Props) {
  useEffect(() => {
    const root = am5.Root.new('chartdiv')

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)])

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        // panX: true,
        // panY: true,
        // wheelX: 'none',
        // wheelY: 'none',
      })
    )

    // chart.children.unshift(
    //   am5.Label.new(root, {
    //     text: 'This is a chart title',
    //     fontSize: 25,
    //     fontWeight: '500',
    //     textAlign: 'center',
    //     x: am5.percent(50),
    //     centerX: am5.percent(50),
    //     paddingTop: 0,
    //     paddingBottom: 0,
    //   })
    // )

    let data2 = data.map((d: any) => ({
      network: d.realm,
      value: Math.floor(+d.budget_crntam_sum / 1_000_000),
    }))

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 20,
    })

    yRenderer.grid.template.set('location', 1)

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: 'network',
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, { themeTags: ['axis'] }),
      })
    )

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        max: data2[0].value,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    )

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: '예산현액',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'value',
        categoryYField: 'network',
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'left',
          labelText: '{valueX}',
        }),
      })
    )

    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      strokeOpacity: 0,
    })

    series.columns.template.adapters.add('fill', (fill, target) =>
      chart.get('colors')?.getIndex(series.columns.indexOf(target))
    )

    series.columns.template.adapters.add('stroke', (stroke, target) =>
      chart.get('colors')?.getIndex(series.columns.indexOf(target))
    )

    yAxis.data.setAll(data2)
    series.data.setAll(data2)
    sortCategoryAxis()

    chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
        xAxis: xAxis,
        yAxis: yAxis,
      })
    )

    // Get series item by category
    function getSeriesItem(category: any) {
      for (var i = 0; i < series.dataItems.length; i++) {
        let dataItem = series.dataItems[i]
        if (dataItem.get('categoryY') == category) {
          return dataItem
        }
      }
    }

    // Axis sorting
    function sortCategoryAxis() {
      series.dataItems.sort((x, y) => {
        return (x.get('valueX') ?? 0) - (y.get('valueX') ?? 0) // descending
        //return y.get("valueY") - x.get("valueX"); // ascending
      })

      // Go through each axis item
      am5.array.each(yAxis.dataItems, (dataItem) => {
        // get corresponding series item
        let seriesDataItem = getSeriesItem(dataItem.get('category'))

        if (seriesDataItem) {
          // get index of series data item
          let index = series.dataItems.indexOf(seriesDataItem)

          // calculate delta position
          let deltaPosition = (index - dataItem.get('index', 0)) / series.dataItems.length

          // set index to be the same as series data item index
          dataItem.set('index', index)

          // set deltaPosition instanlty
          dataItem.set('deltaPosition', -deltaPosition)

          // animate delta position to 0
          dataItem.animate({
            key: 'deltaPosition',
            to: 0,
            duration: 1000,
            easing: am5.ease.out(am5.ease.cubic),
          })
        }
      })

      // Sort axis items by index.
      // This changes the order instantly, but as deltaPosition is set,
      // they keep in the same places and then animate to true positions.
      yAxis.dataItems.sort((x, y) => (x.get('index') ?? 0) - (y.get('index') ?? 0))
    }

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000)
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data])

  return <div id="chartdiv" className="h-[600px]" />
}
