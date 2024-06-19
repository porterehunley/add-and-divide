import { useRef, useLayoutEffect } from "react";
import * as d3 from 'd3';

// Uses d3 to create a chord graph
interface ChordGraphProps {
  flow: number[][];
  colors: string[];
}

export default function ChordGraph({flow, colors}: ChordGraphProps) {
  const vizAnchor = useRef(null);

  useLayoutEffect(() => {
    if (vizAnchor) {
      renderChart(vizAnchor.current)
    }
  }, [vizAnchor])

  function renderChart(el: SVGSVGElement | null) {
    const width = 440;
    const height = 440;

    const svg = d3.select(el)
      .attr("width", width)
      .attr("height", height)

    const res = d3.chord()
      .padAngle(.05)
      .sortSubgroups(d3.descending)
      (flow)

    svg.datum(res)
      .append('g')
      .selectAll('g')
      .data(d => (d.groups))
      .enter()
      .append('g')
      .append('path')
        .style('fill', (d,i) => (colors[i]))
        .style('stroke', 'black')
        .attr('d', d => d3.arc()({
          innerRadius: 200,
          outerRadius: 210,
          startAngle: d.startAngle,
          endAngle: d.endAngle
        }));

    svg.datum(res)
      .append('g')
      .selectAll('path')
      .data(d => (d))
      .enter()
      .append('path')
        .attr('d', d => d3.ribbon().radius(200)(d))
        .style('fill', (d) => (colors[d.source.index]))
        .style('stroke', 'black');
  }

  return (
    <div>
      <svg id='content' ref={vizAnchor}/>
    </div>
  );
}