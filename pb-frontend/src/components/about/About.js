import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../styles/About.css';

class About extends Component {
    render() {
        return(
            <div>
    			<div className="flex-container">
    				<div className="container about-project flex-item flex-item-left">
    					<h2>About the Project</h2>
                        <div className="line"></div>
                        <p>After developing a model at Dartmouth College to predict outbreaks and movements of Southern Pine Beetles, Professor Ayres and Aoki approached Dartmouth’s DALI Lab to design and develop a tool to visualize the trapping data and predictions gathered annually. This project aimes to deploy a product that field researchers, USFS personel, and the general public can use to understand trends in pine beetle movements.</p>
                        <div id="images-about">
                            <img src={require("../../assets/usfs.png")} id="usfs-img-about" alt="United States Forest Service Logo"></img>
                            <img src={require("../../assets/dartmouth.png")} id="dart-img-about" alt="Dartmouth College Logo"></img>
    						<img src={require("../../assets/sgsf.png")} id="sgfs-img-about" alt="Southern Group of State Foresters Logo"></img>
                        </div>
                        <p id="more-info-text">For information specifically about Southern Pine Beetles or various national forests, please contact the <em><a href="https://www.fs.fed.us/" target="_blank" rel="noopener noreferrer">US Forest Service.</a></em></p>
    				</div>
    				<div className="container using-product flex-item flex-item-right">
                        <h2>Using the Product</h2>
                        <div className="line"></div>
                        <p>To view the data, navigate to the <Link to="/viewdata"><strong><em>View Data</em></strong></Link> page. Here users can see graphical representations of the data as well as outbreak predictions and rankings from the statistical model. Use the selection boxes, slicers, and filters to adjust what data you are viewing. Users can adjust the range of years visualized as well as states, national forests, and local forests. Click the Reset Filters button to view all data.</p>
    					<p>Above the graphs is a geographic representation of the trapping data from ArcGIS. Adjust the top menu buttons to see data from different ranges and play around with the graph to see changes in recent years. Click the Expand Map button to move the prediction model down and view the map in full screen. Please see the contact information at right for feature requests. Please note this website uses cookies to enhance user experience. To learn more, please see the <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank" rel="noopener noreferrer">following</a>.</p>
                    </div>
    			</div>

                <div className="flex-container">
    				<div className="container next-steps flex-item flex-item-left">
    					<h2>Next Steps</h2>
    					<div className="line"></div>
    					<p>Moving forward, this tool will show rich data visualizations that allow users to drill into data and understand pine beetle movements in their region. It will also be updated to include a more flexible and fully developed map visualization showing outbreak densities that are more intuitive and easier to understand. Furthermore, this tool will provide spreadsheet visualizations, allowing users to export .csv files to further explore the data. Additionally, the statistical model used to predict Southern Pine Beetle outbreaks will continue to be enhanced and updated to accurately predict pine beetle movements.</p>
    					<p>Be sure to come back to this site often to check up on progress being made. We look forward to deploying a product that allows USFS researchers, government agencies, and even the general public to explore changes happening throughout the nation in the near future.</p>
    				</div>

                    <div className="container contact-info flex-item flex-item-right">
                        <h2>Contact Information</h2>
                        <div className="line"></div>

                        <div id="contact-info-area">
                            <h4>Questions about the program</h4>
                            <div className="info-box">
                                <h3>Carissa Aoki</h3>
                                <a href="mailto:caoki@bates.edu">caoki@bates.edu</a>
                                <br></br>
                                <h3 id="pad-top">Matt Ayres</h3>
                                <a href="mailto:matthew.p.ayres@dartmouth.edu">matthew.p.ayres@dartmouth.edu</a>
                            </div>

                            <h4>Questions about local forests</h4>
                            <div className="info-box">
                                <h3>USDA Forest Service</h3>
                                <span>(800) 832-1355</span>
                            </div>

                            <h4>Questions about the tool</h4>
                            <div className="info-box">
                                <h3>Dartmouth DALI Lab</h3>
                                <a href="mailto:pine-beetle@dali.dartmouth.edu">pine-beetle@dali.dartmouth.edu</a>
                            </div>
                        </div>
                    </div>
                </div>
    		</div>
        );
    }
}

export default About
