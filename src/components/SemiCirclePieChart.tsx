'use client'

import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { useEffect } from 'react'

type Props = {
  id: string
  data: Record<string, any>[]
  keyField: string
  valueField: string
}

export default function SemiCirclePieChart({ id, data, keyField, valueField }: Props) {
  useEffect(() => {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    const root = am5.Root.new(id)

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)])

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    // start and end angle must be set both for chart and series
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        startAngle: 180,
        endAngle: 360,
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
      })
    )

    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    // start and end angle must be set both for chart and series

    // const tooltip = am5.Tooltip.new(root, { pointerOrientation: 'down' })

    // tooltip.label.setAll({
    //   oversizedBehavior: 'wrap',
    //   maxWidth: 180,
    //   textAlign: 'center',
    // })

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: '예산현액 비율',
        startAngle: 180,
        endAngle: 360,
        valueField: valueField,
        categoryField: keyField,
        alignLabels: false,
        // tooltip,
      })
    )

    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: "{valuePercentTotal.formatNumber('0.0')}%",
          fill: root.interfaceColors.get('alternativeText'),
          centerY: am5.p50,
          centerX: am5.p50,
          populateText: true,
        }),
      })
    )

    series.labels.template.setAll({
      text: '{category}',
      maxWidth: 150,
      oversizedBehavior: 'truncate',
    })

    series.states.create('hidden', {
      startAngle: 180,
      endAngle: 180,
    })

    series.slices.template.setAll({
      cornerRadius: 5,
    })

    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    series.data.setAll(data)

    chart.root.dom.style.height = `${data.length * 40}px`

    series.appear(1000)
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data, id])

  return <div id={id} />
}
