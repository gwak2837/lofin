'use client'

import { axisBottom, axisLeft, scaleBand, scaleLinear, select } from 'd3'
import { useEffect, useRef } from 'react'

type Props = {
  data: any
}

export default function HorizontalBarGraph({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    async function drawChart() {
      // set the dimensions and margins of the graph
      const margin = { top: 30, right: 30, bottom: 90, left: 120 }
      const width = 1000 - margin.left - margin.right
      const height = 500 - margin.top - margin.bottom

      // append the svg object to the body of the page
      const svg = select(svgRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      svg
        .append('text')
        .attr('class', 'text-sm')
        .attr('text-anchor', 'end')
        .attr('x', width)
        .attr('y', 0)
        .text('단위: 백만')

      // X axis
      const x = scaleLinear()
        .domain([0, data[0].budget_crntam_sum / 1_000_000])
        .range([0, width])
      svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')

      // Y axis
      const y = scaleBand()
        .range([0, height])
        .domain(data.map((expenditure: any) => expenditure.realm))
        .padding(0.1)
      svg.append('g').call(axisLeft(y))

      //Bars
      svg
        .selectAll('myRect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', x(0))
        .attr('y', (expenditure: any) => y(expenditure.realm) as any)
        .attr('width', (d: any) => x(d.budget_crntam_sum / 1_000_000))
        .attr('height', y.bandwidth())
        .attr('fill', '#617e8f')
    }
    drawChart()
  }, [data])

  return <svg className="mx-auto" style={{ width: '1000px', height: '500px' }} ref={svgRef} />
}
