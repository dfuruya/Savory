import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateMeal } from '../actions';
import { browserHistory } from 'react-router';

class Mealview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meal: {},
      submitDisable: false,
      paymentError: null,
      // quantity: 1,
      // price: this.props.mealState.price,
      // total: this.props.mealState.price,
      
    };
    // this.handleIncrement = this.handleIncrement.bind(this);
    // this.handleDecrement = this.handleDecrement.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleStripeSubmit = this.handleStripeSubmit.bind(this);
  }



  componentDidMount() {
    Stripe.setPublishableKey('pk_test_XEXhLE6bcWx5GBeDrsDkSvyy');
  }

  // handleIncrement() {
  //   this.setState({ quantity: this.state.quantity + 1});
  //   console.log('the total', this.state.total)
  //   this.setState({ total: (this.state.quantity + 1) * this.state.price});
  //   console.log('the real total', this.state.total)
  // }

  // handleDecrement() {
  //   this.setState({ quantity: this.state.quantity - 1});
  //   this.setState({ total: (this.state.quantity -1) * this.state.price});
  // }

  handleError(err) {
    Materialize.toast(`${err}`, 4000, 'pink lighten-2');
  }

  handleStripeSubmit(e) {
    const context = this;
    e.preventDefault();
    this.setState({ submitDisable: true, paymentError: null });

    Stripe.card.createToken(e.target, (status, res) => {
      console.log('the status', status);
      const mealObj = context.props.mealState;
      console.log('the ressssss----', res);
      
      if (status === 402) {
        Materialize.toast(res.error.message, 4000, 'pink lighten-2');
        return;
      }
      console.log('the respone stripe', res);
      res.amount = context.props.mealState.price;
      res.food = context.props.mealState.food;
      res.chefId = context.props.mealState.chefId;
      axios.post('/api/payments', res)
        .then((response) => {
          Materialize.toast(response.data.message, 4000, 'indigo lighten-2');
          console.log(response.data.message);
        })
          .then(() => { axios.post('/api/createorder', mealObj) })
          .then((response) => {
            console.log('we saved the order yo!', response);
            browserHistory.push('/orderstatus');
          })
          .catch(this.handleError);
    });
  }

  render() {
    return (
        <div>
        <div className="themode paymode right">
          <div className="alignleft">
          <b className="boldsubtitle underline">Delivery Address: </b>
          <ul>
            <li>{this.props.mealState.user_name} </li>
            <li>{this.props.mealState.user_address} </li>
            <li>{this.props.mealState.user_phone} </li>
          </ul>
          <b className="boldsubtitle"> Checkout Total: ${this.props.mealState.price}</b>
          </div>
          <br />
          <i>Please enter your credit card info.</i>
          <form onSubmit={this.handleStripeSubmit} >
            <input type="text" data-stripe="number" placeholder="credit card number" /><br />
            <input type="text" data-stripe="exp-month" placeholder="expiration month" /><br />
            <input type="text" data-stripe="exp-year" placeholder="expiration year" /><br />
            <input type="text" data-stripe="cvc" placeholder="cvc" /><br />
            <input className="btn black-text menubuttons" type="submit" value="Purchase" />
          </form>
        </div>
          <div className="themode mealviewform relpos center">
            <ul className="center">
            <li className="bigboldsubtitle">{this.props.mealState.food} </li>
              <li><img className="mealviewimagepreview" src={this.props.mealState.image} /></li>
              <li className="boldsubtitle">Meal Info</li>
              <li>Price: ${this.props.mealState.price} </li>
              <li>Quantity: {this.props.mealState.quantity} </li>
              <li>Chef: {this.props.mealState.chef_name}</li>
              <li>Phone: {this.props.mealState.chef_phone === "" ? 'N/A' : this.props.mealState.chef_phone} </li>
            </ul>
          </div>
    
        </div>
    );
  }
}

const mapStateToProps = ({ mealState }) => ({ mealState });

const mapDispatchToProps = (dispatch) => {
  return {
    updateMeal: (response) => dispatch(updateMeal(response)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mealview);

// var displayReviews = this.state.reviews.map( function(review){
//   return (
//     <ul>
//       <li>{review.username}</li>
//       <li>{review.comment}</li>
//       <li>{review.rating}</li>
//     </ul>
//     );
//   });


// <div><img style={{width:'200px'}} src={this.state.image} /></div>
// <p>{this.state.chef_name}</p>
// <p>{this.state.chefDescription}</p>
// <p>{this.state.rating}</p>
// <div>
//   <div>Reviews</div>
//   {displayReviews}
// </div>
// <Orderbox 
// date={this.state.date}
// timeBlock={this.state.timeBlock}
// price={this.state.price}
// quantity={this.state.quantity}
// deliveryCharge={this.state.deliveryCharge}
// checkoutTotal={this.state.checkoutTotal}
// />

// <a href="https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_8kQux35EriTK7xxw2Bvhcuz0PXwpP0rw&scope=read_write">connect to stripe</a>
