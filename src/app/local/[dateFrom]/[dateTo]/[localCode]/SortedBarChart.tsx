'use client'

import * as am5 from '@amcharts/amcharts5'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5xy from '@amcharts/amcharts5/xy'
import { useEffect, useRef } from 'react'

import { vw } from '../../../../../common/utils'

type Props = {
  id: string
  data: any
}

export default function SortedBarChart({ id, data }: Props) {
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
        // panX: true,
        // panY: true,
        wheelX: 'zoomY',
        wheelY: 'panY',
      })
    )

    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    )

    // Data
    const data2 = data.map((d: any) => ({
      network: d.realm,
      value: Math.floor(+d.budget_crntam_sum / 1_000_000),
    }))

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    const yRenderer = am5xy.AxisRendererY.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minGridDistance: 20,
    })

    yRenderer.grid.template.set('location', 1)

    yRenderer.labels.template.setAll({
      oversizedBehavior: 'truncate',
      maxWidth: vw(25),
      textAlign: 'right',
    })

    const tooltip = am5.Tooltip.new(root, { pointerOrientation: 'down' })

    tooltip.label.setAll({
      oversizedBehavior: 'wrap',
      maxWidth: vw(25) - 10,
      textAlign: 'center',
    })

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'network',
        maxDeviation: 0,
        renderer: yRenderer,
        tooltip: tooltip,
      })
    )

    yAxis.labelsContainer.set(
      'tooltip',
      am5.Tooltip.new(root, {
        pointerOrientation: 'down',
      })
    )

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

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    const series = chart.series.push(
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

    // Get series item by category
    function getSeriesItem(category: any) {
      for (var i = 0; i < series.dataItems.length; i++) {
        const dataItem = series.dataItems[i]
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
        const seriesDataItem = getSeriesItem(dataItem.get('category'))

        if (seriesDataItem) {
          // get index of series data item
          const index = series.dataItems.indexOf(seriesDataItem)

          // calculate delta position
          const deltaPosition = (index - dataItem.get('index', 0)) / series.dataItems.length

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

    chart.root.dom.style.height = `${data.length * 50 + 100}px`

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000)
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data, id])

  return <div id={id} />
}
