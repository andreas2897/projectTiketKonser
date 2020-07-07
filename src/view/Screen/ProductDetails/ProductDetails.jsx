import React from "react";
import { connect } from "react-redux";
import swal from "sweetalert";

import "./ProductDetails.css";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
// import { fillCart } from "../../../redux/actions";

class ProductDetails extends React.Component {
  state = {
    category: "vvip",
    concertData: {
      image: "",
      concertName: "",
      artist: "",
      vvipPrice: 0,
      vipPrice: 0,
      regularPrice: 0,
      location: "",
      id: 0,
    },
    addToCartData: {
      quantity: 0,
    },
  };

  addToCartHandler = () => {
    Axios.post(`${API_URL}/carts`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    Axios.get(`${API_URL}/concerts/${this.props.match.params.concertId}`)
      .then((res) => {
        this.setState({ concertData: res.data });
        // console.log(this.state.concertData.vvipPrice);
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

  render() {
    const {
      concertName,
      image,
      price,
      location,
      artist,
      category,
      id,
    } = this.state.concertData;
    return (
      <div className="container">
        <div className="row py-4">
          <div className="col-6 text-center">
            <img
              style={{ width: "100%", objectFit: "contain", height: "550px" }}
              src={image}
              alt=""
            />
          </div>
          <div className="col-6 d-flex flex-column justify-content-center">
            <h3>{concertName}</h3>
            <h4>{artist}</h4>
            <p className="mt-4">{location}</p>
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
                value={this.state.category}
                onChange={(e) =>
                  this.setState({
                    quantity: e.target.value,
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
              }).format(this.renderConcertPrice())}
            </h5>

            {/* <TextField type="number" placeholder="Quantity" className="mt-3" /> */}
            <div className="d-flex flex-row mt-4">
              <ButtonUI onClick={this.addToCartHandler}>Add To Cart</ButtonUI>
              <ButtonUI className="ml-4" type="outlined">
                Add To Wishlist
              </ButtonUI>
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
  // onFillCart: fillCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
