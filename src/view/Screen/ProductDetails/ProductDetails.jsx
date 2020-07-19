import React from "react";
import { connect } from "react-redux";
import swal from "sweetalert";

import "./ProductDetails.css";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { fillCart } from "../../../redux/actions";

class ProductDetails extends React.Component {
  state = {
    category: "vvip",
    totalPrice: 0,
    concertData: {
      id: 0,
      concertName: "",
      concertArtist: "",
      concertLocation: "",
      concertImage: "",
      concertDate: "",
      category: "",
      vvipPrice: "",
      vvipCapacity: 0,
      vipPrice: "",
      vipCapacity: 0,
      regularPrice: "",
      regularCapacity: 0,
    },
    addToCartData: {
      quantity: 1,
    },
  };

  addToCartHandler = () => {
    Axios.post(
      `${API_URL}/carts/addcart/${this.props.user.id}/${this.state.concertData.id}`,
      this.state.addToCartData,
      {
        params: {
          totalPrice:
            this.renderConcertPrice() * this.state.addToCartData.quantity,
          ticketType: this.state.category,
        },
      }
    )
      .then((res) => {
        console.log(res.data);
        swal("Success!", "Your item has been added", "success");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    Axios.get(`${API_URL}/concert/${this.props.match.params.concertId}`)
      .then((res) => {
        this.setState({ concertData: res.data });
        this.renderBuyButton();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderConcertPrice = () => {
    switch (this.state.category) {
      case "vvip":
        return this.state.concertData.vvipPrice;
      case "vip":
        return this.state.concertData.vipPrice;
      case "regular":
        return this.state.concertData.regularPrice;
      default:
        return 0;
    }
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  renderTotalPrice = () => {
    return this.renderConcertPrice() * this.state.addToCartData.quantity;
  };

  renderBuyButton = () => {
    const today = new Date();
    if (today.toString() >= this.state.concertData.concertDate.toString()) {
      return <ButtonUI onClick={this.addToCartHandler}>Buy</ButtonUI>;
    } else {
      return <h5>Your Concert already passed</h5>;
    }
  };

  render() {
    const {
      concertName,
      concertImage,
      concertDate,
      price,
      concertLocation,
      concertArtist,
      category,
      id,
    } = this.state.concertData;
    return (
      <div className="container">
        <div className="row py-4">
          <div className="col-6 text-center">
            <img
              style={{ width: "100%", objectFit: "contain", height: "550px" }}
              src={concertImage}
              alt=""
            />
          </div>
          <div className="col-6 d-flex flex-column justify-content-center">
            <h3>{concertName}</h3>
            <h4>{concertArtist}</h4>
            <h4>
              {concertLocation},{concertDate}
            </h4>
            <p></p>
            <div className="d-flex justify-content-between align-items-center">
              <h5>Category :</h5>
              <select
                value={this.state.category}
                onChange={(e) =>
                  this.setState({
                    category: e.target.value,
                  })
                }
                className="form-control w-50"
              >
                <option value="vvip">VVIP</option>
                <option value="vip">VIP</option>
                <option value="regular">REGULAR</option>
              </select>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <h5>Quantity :</h5>
              <select
                value={this.state.addToCartData.quantity}
                onChange={(e) =>
                  this.setState({
                    addToCartData: {
                      ...this.state.addToCartData,
                      quantity: e.target.value,
                    },
                  })
                }
                className="form-control w-50"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <h5>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(this.renderTotalPrice())}
            </h5>
            {/* <TextField type="number" placeholder="Quantity" className="mt-3" /> */}
            <div className="d-flex flex-row mt-4 align-items-center">
              {this.renderBuyButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  onFillCart: fillCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
