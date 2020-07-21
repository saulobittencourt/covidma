import React, { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { max,min } from 'd3-array'
import { timeDay } from 'd3-time'
import { timeFormat } from 'd3-time-format'
import { scaleLinear, scaleTime } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'

// margin convention often used with D3
const margin = { top: 80, right: 60, bottom: 80, left: 60 }
const width = document.body.clientWidth - margin.left - margin.right
const height = 600 - margin.top - margin.bottom
const color = ['#FE413C','#f05440', '#d5433d', '#b33535', '#283250','#1058b5']
let header = null;

const BarChart = ({ data }) => {
  const d3svg = useRef(null)
  const confirmedData = data.confirmedData;
  const deathsData = data.deathsData;

  useEffect(() => {
    if (data && d3svg.current) {
      let svg = select(d3svg.current)

      // scales
      const yMax = max(confirmedData, d => d.value)
      const xMin = min(confirmedData, d => d.reference)

      const xScale = scaleTime()
        .domain([new Date(xMin+" 00:00:00"),Date.now()])
        .range([0, width])

      const yScale = scaleLinear()
        .domain([0,yMax])
        .range([height,0])

      // append group translated to chart area
      svg = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

      // draw header
      header = svg
        .append('g')
        .attr('class', 'bar-header')
        .attr('transform', `translate(0, ${-margin.top / 2})`)

      header.append('text')
        .attr('class','font-weight-bold')
        .style('font-size',25)
        .text('CASOS CONFIRMADOS ACUMULADOS')

      header.append('text')
        .attr('y',25)
        .html('<tspan fill="'+color[0]+'">■</tspan> Confirmados')

      header.append('text')
        .attr('x',122)
        .attr('y',25)
        .html('<tspan>■</tspan> Óbitos')

      // header.append('text')
      //   .attr('x',200)
      //   .attr('y',25) 
      //   .html('<tspan fill="#1058b5">■</tspan> Recuperados')


      // draw axes
      const xAxis = axisBottom(xScale);
      xAxis.ticks(timeDay.every(1))
        .tickFormat(timeFormat("%d/%m"))

      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height + margin.bottom / 3})`)
        .call(xAxis)

      svg.selectAll('x.axis g.tick text')
        .attr('style','transform:translate(-15px, 21px) rotate(-90Deg)')
        

      const yAxis = axisLeft(yScale)
      svg
        .append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${-margin.left / 3},0)`)
        .call(yAxis)

      // draw confimed bars
      let confirmedGroup = svg
        .selectAll('.bar')
        .data(confirmedData)
        .enter()
        .append('g')

      confirmedGroup.append('rect')
        .attr('class', 'bar')
        .attr('rx', '3')
        .attr('y',d => yScale(d.value))
        .attr('x', d => xScale(new Date(d.reference+' 00:00:00'))-2)
        .attr('width', 5)
        .attr('height', d => height-yScale(d.value))
        .style('fill', color[0] )

      confirmedGroup.append('title')
        .text(d=> 'Confirmados: '+d.reference.substring(8)+'/'+d.reference.substring(5,7)+' '+d.value )

        // draw confimed bars
      let deathsGroup = svg
          .selectAll('.death-bar')
          .data(deathsData)
          .enter()
          .append('g')

      deathsGroup.append('rect')
          .attr('class', 'bar')
          .attr('rx', '3')
          .attr('y',d => yScale(d.value))
          .attr('x', d => xScale(new Date(d.reference+' 00:00:00'))-2)
          .attr('width', 5)
          .attr('height', d => height-yScale(d.value))
          .style('fill', 'black' )

      deathsGroup.append('title')
        .text(d=> 'Obitos: '+d.reference.substring(8)+'/'+d.reference.substring(5,7)+' '+d.value )
      

      // draw grid
      svg.append('g')
        .attr('class', 'grid')
        .selectAll('line.grid')
        .data(yAxis.scale().ticks())
        .enter()
        .append('line')
          .attr('class', 'grid')
          .attr('stroke', 'lightgray')
          .attr('x1',-19)
          .attr('y1',d => yScale(d))
          .attr('x2',width)
          .attr('y2', d=>yScale(d))
    }
  }, [data])

  return (
    <svg
      className="bar-chart-container"
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      role="img"
      ref={d3svg}
    ></svg>
  )
}

export default BarChart

// style={{ pointerEvents: 'all', width: '100%', height: '100%' }}