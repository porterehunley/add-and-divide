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
    if (vizAnchor && flow.length) {
      renderChart(vizAnchor.current)
    }
  }, [vizAnchor, flow])

  function renderChart(el: SVGSVGElement | null) {
    const width = 220;
    const height = 220;
    const radius = 100;

    const svg = d3.select(el)
      .attr("width", width)
      .attr("height", height)
      .select('#chart-body')
        .attr("transform", `translate(${width/2}, ${height/2})`);

    const circles = svg.selectAll('circle')
      .data(flow);

    const angleStep = (2 * Math.PI) / flow.length;

    const paths = svg.selectAll('path')
      .data(flow.flatMap(
        (row, i) => row.map(
          (value, j) => ({ source: i, target: j, value, color: colors[i] })
        ).filter(v => v.value > 0)
      ));

    paths.enter()
      .append('path')
      .attr('d', d => {
        const sourceAngle = d.source * angleStep;
        const targetAngle = d.target * angleStep;
        const sourceX = radius * Math.cos(sourceAngle);
        const sourceY = radius * Math.sin(sourceAngle);
        const targetX = radius * Math.cos(targetAngle);
        const targetY = radius * Math.sin(targetAngle);
        return `M${sourceX},${sourceY}A${radius},${radius} 0 0,1 ${targetX},${targetY}`;
      })
      .style('fill', 'none')
      .style('stroke', (d)=> (d.color))
      .style('stroke-width', 2);

    circles.enter()
      .append('circle')
      .attr('cx', (d, i) => radius * Math.cos(i * angleStep)) // x-coordinate based on angle
      .attr('cy', (d, i) => radius * Math.sin(i * angleStep)) // y-coordinate based on angle
      .attr('r', 10) // Radius of the circle
      .style('fill', (d, i) => colors[i % colors.length]); // Use colors from the colors array
  }

  return (
    <div>
      <svg id='content' ref={vizAnchor}>
        <g id='chart-body'/>
      </svg>
    </div>
  );
}