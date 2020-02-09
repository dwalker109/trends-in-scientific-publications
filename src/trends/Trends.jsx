import { createSelector } from "@reduxjs/toolkit";
import * as d3 from "d3";
import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const selectGrouped = createSelector(
  state => state.search.resultSets,
  resultSets => {
    const current = _.last(resultSets) || null;

    if (!current) return null;

    return _(current.eSummaryResult)
      .countBy(it => it.date)
      .mapValues((qty, year) => ({ year, qty }))
      .toArray()
      .value();
  }
);

const Trends = () => {
  const rawData = useSelector(selectGrouped);
  // const rawData = [
  //   { year: "2016", qty: 1 },
  //   { year: "2017", qty: 2 },
  //   { year: "2018", qty: 3 }
  // ];

  const d3Ref = useRef(null);

  useEffect(() => {
    if (rawData && d3Ref.current) {
      const svg = d3.select(d3Ref.current);
      const margin = 200;
      const width = Number(svg.attr("width")) - margin;
      const height = Number(svg.attr("height")) - margin;

      var xScale = d3
          .scaleBand()
          .range([0, width])
          .padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

      var g = svg
        .append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

      xScale.domain(rawData.map(d => d.year));

      yScale.domain([0, d3.max(rawData, d => d.qty)]);

      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

      g.append("g").call(
        d3
          .axisLeft(yScale)
          .tickFormat(d => d)
          .ticks(10)
      );

      g.selectAll(".bar")
        .data(rawData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.qty))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.qty));
    }
  }, [rawData]);

  return (
    <div className="Trends">
      <svg className="Trends-chart" width={500} height={500} ref={d3Ref} />
    </div>
  );
};

export default Trends;
