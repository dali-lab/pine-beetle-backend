import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';
import math from 'mathjs';
import '../../styles/historical-data/BarChartArea.css';

class BarChartArea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chartData: {
                labels: [],
                datasets: [
                    {
                        data: [],
                        label: "Total Spots",
                        backgroundColor: "#1f77b4",
                        hoverBackgroundColor: "#e9c46a"
                    },
                    {
                        data: [],
                        label: "Total SPB Per Two Weeks",
                        backgroundColor: "#ff7f0e",
                        hoverBackgroundColor: "#e9c46a"
                    },
                    {
                        data: [],
                        label: "Total Clerids Per Two Weeks",
                        backgroundColor: "#2ca02c",
                        hoverBackgroundColor: "#e9c46a"
                    }
                ]
            }, // used for chartjs line chart
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    yAxes : [{
                        ticks : {
                            max : 1000,
                            min : 0
                        }
                    }]
                }
            },
            spotsMean: 0,
            spotsSD: 0,
            spbMean: 0,
            spbSD: 0,
            cleridsMean: 0,
            cleridsSD: 0
        }

        this.updateStateFromProps = this.updateStateFromProps.bind(this);
    }
    render() {
        return(
            <div className="flex-container" id="data-insights-holder">
                <div className="container data-insights flex-item" id="data-insights">
                        <Bar data={this.state.chartData} height={400} options={this.state.chartOptions}/>
                </div>
    		</div>
        );
    }

    // on mount, update the state
    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if we are receiving new data, update the state before rendering
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    // recalculate values to show on page
    updateStateFromProps(props) {
        if (props.data !== null) {
            if (props.data.length !== 0) {
                // create data object for line chart
                var chartData = {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            label: "Total Spots",
                            borderColor: "#1f77b4",
                            fill: false
                        },
                        {
                            data: [],
                            label: "Total SPB Per Two Weeks",
                            borderColor: "#ff7f0e",
                            fill: false
                        },
                        {
                            data: [],
                            label: "Total Clerids Per Two Weeks",
                            borderColor: "#2ca02c",
                            fill: false
                        }
                    ]
                }

                // initialize data arrays
                var spots = []
                var spb = []
                var clerids = []

                var startDate = props.firstObservedYear;
                var endDate = props.lastObservedYear;

                // initialize sum for each year
                for (var yearNum = 0; yearNum <= (parseInt(endDate) - parseInt(startDate)); yearNum++) {
                    spots[yearNum] = 0
                    spb[yearNum] = 0
                    clerids[yearNum] = 0
                }

                // add data and labels to object
                for (var i in props.data) {
                    var year = props.data[i].year
                    var yearNum = year - startDate

                    // update spots count
                    if (props.data[i].spots != null) {
                        spots[yearNum] += props.data[i].spots
                    }

                    // update spb per two weeks count
                    if (props.data[i].spbPerTwoWeeks != null) {
                        spb[yearNum] += props.data[i].spbPerTwoWeeks
                    }

                    // update clerids per two weeks count
                    if (props.data[i].cleridsPerTwoWeeks != null) {
                        clerids[yearNum] += props.data[i].cleridsPerTwoWeeks
                    }

                    // add to the line chart's label if we haven't yet found this day
                    if (!chartData.labels.includes(year)) {
                        chartData.labels.push(year);
                    }
                }

                // update chartData
                chartData.datasets[0].data = spots
                chartData.datasets[1].data = spb
                chartData.datasets[2].data = clerids

                // maximum value found in the array
                var max = 0

                // adjust y-axis height
                for (var entry in chartData.datasets[0].data) {
                    if (chartData.datasets[0].data[entry] > max) {
                        max = chartData.datasets[0].data[entry]
                    }
                }
                for (entry in chartData.datasets[1].data) {
                    if (chartData.datasets[1].data[entry] > max) {
                        max = chartData.datasets[1].data[entry]
                    }
                }
                for (entry in chartData.datasets[2].data) {
                    if (chartData.datasets[2].data[entry] > max) {
                        max = chartData.datasets[2].data[entry]
                    }
                }

                var spotsMean = 0;
                var spotsSD = 0;
                var spbMean = 0;
                var spbSD = 0;
                var cleridsMean = 0;
                var cleridsSD = 0;

                // compute mean and standard deviations
                if (chartData.datasets[0].data.length > 0) {
                    spotsMean = math.mean(chartData.datasets[0].data)
                    spotsSD = math.std(chartData.datasets[0].data)
                }
                if (chartData.datasets[1].data.length > 0) {
                    spbMean = math.mean(chartData.datasets[1].data)
                    spbSD = math.std(chartData.datasets[1].data)
                }
                if (chartData.datasets[2].data.length > 0) {
                    cleridsMean = math.mean(chartData.datasets[2].data)
                    cleridsSD = math.std(chartData.datasets[2].data)
                }

                // set new y-axis height
                this.state.chartOptions.scales.yAxes[0].ticks.max = max

                // update state
                this.setState({
                    chartData: chartData,
                    spotsMean: spotsMean,
                    spotsSD: spotsSD,
                    spbMean: spbMean,
                    spbSD: spbSD,
                    cleridsMean: cleridsMean,
                    cleridsSD: cleridsSD
                });
            }
        }    
    }
}

export default BarChartArea
