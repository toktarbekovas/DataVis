async function buildPlot() {
    // console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const xAccessor = (d) => dateParser(d.date);
    const yAccessor1 = (d) => d.temperatureHigh;
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform", `translate(${dimension.margin.left}px,${dimension.margin.top}px)`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,0]);
    const referenceBandPlacement = yScale(80);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)))
        .curve(d3.curveBasis);

    const lineGenerator2 = d3.line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor1(d)))
        .curve(d3.curveBasis);

        bounded.append("path")
        const line = bounded
            .attr("d",lineGenerator(data))
            .attr("fill","none")
            .attr("stroke","Red")
            .attr("stroke-width", 1);

        bounded.append("path")
        const line1 = bounded
            .attr("d", lineGenerator2(data))
            .attr("fill", "none")
            .attr("stroke", "Black")
            .attr("stroke-width", 1);

    const yAxisGenerator = d3.axisLeft().scale(yScale);
    const yAxis = bounded.append("g").call(yAxisGenerator)

    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = bounded
        .append("g")
        .call(xAxisGenerator.tickFormat(d3.timeFormat("%b,%y")))
        .style("transform", `translateY(${dimension.boundedHeight}px)`);

    wrapper
        .append("g")
        .style("transform", `translate(${25}px,${15}px)`)
        .attr("class", "title")
        .attr("x", dimension.width / 1)
        .attr("y", dimension.margin.top / 1)
        .attr("text-anchor", "middle")
}

buildPlot();
