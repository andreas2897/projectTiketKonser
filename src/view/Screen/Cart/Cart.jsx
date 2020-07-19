import React from "react";
import "./Cart.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import { logoutHandler, qtyCartHandler } from "../../../redux/actions";
import {
  UncontrolledCollapse,
  Button,
  CardBody,
  Card,
  Badge,
} from "reactstrap";
import { Table, Alert } from "reactstrap";

import swal from "sweetalert";

class UserCart extends React.Component {
  state = {
    itemCart: [],
    kondisiCheckout: true,
    totalPrice: 0,
    status: "pending",
    checOutItem: "",
    quantity: "",
    datePayments: new Date(),
    selectedFile: null,
  };

  inputHandler = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  fileUploadHandler = (e) => {
    this.setState({ selectedFile: e.target.files[0] });
  };

  componentDidMount() {
    this.getItemCart();
  }

  checkboxHandler = (e, idx) => {
    const { checked } = e.target;
    if (checked) {
      this.setState({ checOutItem: [...this.state.checOutItem, idx] });
    } else {
      this.setState({
        checOutItem: [...this.state.checOutItem.filter((val) => val !== idx)],
      });
    }
  };

  deleteItemCart = (id, productId) => {
    Axios.delete(`${API_URL}/carts/${id}/${productId}`)
      .then((res) => {
        console.log(res);
        swal(
          "Delete to cart",
          "Your item has been deleted from your cart",
          "success"
        );
        this.getItemCart();
        this.props.onQtyCartHandler(this.props.user.id);
        // Axios.get(`${API_URL}/carts`, {
        //     params: {
        //       userId: this.props.user.id,
        //       _expand: "product"
        //     }
        //   })
        // .then((res) => {
        //     this.props.onQtyCartHandler(res.data.length)
        // })
        // .catch((err) => {
        //     console.log(err)
        // })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getItemCart = () => {
    let totalPriceItems = 0;
    Axios.get(`${API_URL}/carts/user/${this.props.user.id}`)
      .then((res) => {
        console.log(res.data);
        res.data.map((val) => {
          totalPriceItems += val.totalPrice;
        });
        this.setState({
          itemCart: res.data,
          totalPrice: totalPriceItems,
        });
        console.log(this.state.totalPrice);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderCarts = () => {
    const { itemCart } = this.state;
    return itemCart.map((val, idx) => {
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{val.concerts.concertName}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(val.totalPrice)}
          </td>
          <td>{val.quantity}</td>
          <td>{val.ticketType}</td>
          <td>
            <img
              src={val.concerts.concertImage}
              alt=""
              style={{ height: "50px" }}
            />
          </td>
          <td>
            <input
              type="checkbox"
              onChange={(e) => this.checkboxHandler(e, idx)}
              className="form-control"
            />
          </td>
          <th scope="row">
            <div className="d-flex justify-content-center">
              <ButtonUI
                type="contained"
                onClick={() => this.deleteItemCart(val.id, val.concerts.id)}
              >
                Delete
              </ButtonUI>
            </div>
          </th>
        </tr>
      );
    });
  };

  renderCheckout = () => {
    let totalPriceItems = 0;
    const { itemCart } = this.state;
    return itemCart.map((val, idx) => {
      totalPriceItems += val.totalPrice;
      return (
        <>
          <tr>
            <td>{idx + 1}</td>
            <td>{val.concerts.concertName}</td>
            <td>{val.quantity}</td>
            <td>{val.ticketType}</td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(totalPriceItems)}
            </td>
          </tr>
        </>
      );
    });
  };

  confirmBtn = () => {
    let formData = new FormData();
    formData.append(
      "file",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    Axios.post(
      `${API_URL}/transaction/${this.props.user.id}/${this.state.totalPrice}`,
      {
        status: "pending",
      },
      {
        params: {
          checkoutTime: new Date().toLocaleDateString(),
        },
      }
    )
      .then((res) => {
        //axios gambar
        Axios.post(
          `${API_URL}/transaction/uploadBuktiTransfer/${res.data.id}`,
          formData
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        console.log(res.data.id);
        this.state.itemCart.map((val) => {
          console.log(val.id);
          Axios.post(
            `${API_URL}/transactionDetail/${res.data.id}/${val.concerts.id}`,
            {
              ticketType: val.concerts.ticketType,
            },
            {
              params: {
                priceProduct: val.totalPrice,
                quantity: val.quantity,
              },
            }
          )
            .then((res) => {
              console.log(res.data);

              Axios.delete(`${API_URL}/carts/delete/${val.id}`)
                .then((res) => {
                  console.log(res);
                  this.renderCarts();
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
          //
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  uploadBuktiTrf = () => {};

  render() {
    return (
      <div className="container py-4">
        {this.state.itemCart.length > 0 ? (
          <>
            <Table hover size="sm">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>
                    <div className="d-flex justify-content-center">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>{this.renderCarts()}</tbody>
            </Table>
            <div>
              <Button
                color="primary"
                id="toggler"
                style={{ marginBottom: "1rem" }}
                type="contained"
              >
                Checkout
              </Button>
            </div>
            {this.state.kondisiCheckout ? (
              <div className="justify-content-center">
                <UncontrolledCollapse toggler="#toggler">
                  <Card style={{ width: "530px" }}>
                    <CardBody>
                      <Table striped size="sm" style={{ width: "500px" }}>
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Concert Name</th>
                            <th>Quantity</th>
                            <th>Ticket Category</th>
                            <th>Total Price</th>
                          </tr>
                        </thead>
                        <tbody>{this.renderCheckout()}</tbody>
                      </Table>
                      <div className="mt-6">
                        <p>Please upload transaction :</p>
                      </div>
                      <input type="file" onChange={this.fileUploadHandler} />
                      <h6>
                        Total Price :{" "}
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(this.state.totalPrice)}{" "}
                      </h6>
                      <div className="d-flex justify-content-center">
                        <ButtonUI
                          type="outlined"
                          onClick={() => this.confirmBtn()}
                        >
                          Confirm
                        </ButtonUI>
                      </div>
                    </CardBody>
                  </Card>
                </UncontrolledCollapse>
              </div>
            ) : null}
          </>
        ) : (
          <Alert>
            Your cart is empty! <Link to="/">Go shopping</Link>
          </Alert>
        )}
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
  onQtyCartHandler: qtyCartHandler,
};
export default connect(mapStateToProps, mapDispatchToProps)(UserCart);
