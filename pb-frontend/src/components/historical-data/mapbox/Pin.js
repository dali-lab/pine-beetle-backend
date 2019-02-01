import React, {PureComponent} from 'react';

class Pin extends PureComponent {
    constructor(props) {
        super(props);

        this.ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
          c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
          C20.1,15.8,20.2,15.8,20.2,15.7z`;

        this.lowFill = '#329F5B';
        this.mediumFill = '#ff7f0e';
        this.highFill = '#D65555';
    }
    render() {

        var pinStyle = {
            cursor: 'pointer',
            fill: '#1f77b4',
            stroke: '#fff',
            overflow: 'visible'
        };

        if (this.props.numObjects >= 6) {
            if (this.props.object.spotsClassification === "low") {
                pinStyle.fill = this.lowFill
            }
            else if (this.props.object.spotsClassification === "medium") {
                pinStyle.fill = this.mediumFill
            }
            else {
                pinStyle.fill = this.highFill
            }
        }

        const {size = 20, onClick} = this.props;

        return (
            <svg
                height={size}
                viewBox="0 0 24 24"
                style={{...pinStyle, transform: `translate(${-size / 2}px,${-size}px)`}}
                onClick={onClick} >
                <circle r="9" />
            </svg>
        );

        // // UNCOMMENT THIS FOR A PIN SHAPE INSTEAD OF CIRCLE
        // return (
        //       <svg
        //             height={size}
        //             viewBox="0 0 24 24"
        //             style={{...pinStyle, transform: `translate(${-size / 2}px,${-size}px)`}}
        //             onClick={onClick} >
        //             <path d={this.ICON}/>
        //       </svg>
        // );
    }
}

export default Pin
