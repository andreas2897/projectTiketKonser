import React from "react";
import ButtonUI from "../../components/Button/Button";
import Axios from "axios";
import swal from "sweetalert";
import "./AdminPayment.css";
import { Table } from "reactstrap";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepBackward,
  faFastBackward,
  faStepForward,
  faFastForward,
  faTimes,
} from "@fortawesome/free-solid-svg-icons/";
import { API_URL } from "../../../constants/API";

class AdminPayments extends React.Component {
  state = {
    productList: [],
    datePayments: new Date(),
    activeProducts: [],
    activeProductsSuccess: [],
    activeProductsReject: [],
    activeProductsRejectP: [],
    modalOpen: false,
    modalOpenCheck: false,
    status: "pending",
    formEmail: {
      email: "",
    },
  };

  toggleModalCheck = () => {
    this.setState({ modalOpenCheck: !this.state.modalOpenCheck });
  };

  checkBuktiHandler = (buktiTrf) => {
    this.setState({
      buktiTrf: buktiTrf,
    });
    this.setState({ modalOpenCheck: true });
  };

  getPaymentsList = (val) => {
    console.log(val);
    Axios.get(`${API_URL}/transaction?status=${val}`)
      .then((res) => {
        console.log(res.data);
        this.setState({
          productList: res.data,
          status: val,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    {
      this.getPaymentsList(this.state.status);
    }
  }

  confirmBtnHandler = (transactionId) => {
    Axios.put(
      `${API_URL}/transaction/accept/${transactionId}?acceptTime=${new Date().toLocaleDateString()}`
    )
      .then((res) => {
        console.log(res.data);
        this.toggleModal();
        this.renderProductList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  rejectBtnHandler = (transactionId) => {
    Axios.put(`${API_URL}/transaction/reject/${transactionId}`)
      .then((res) => {
        console.log(res.data);
        this.renderProductList();
      })
      .catch((err) => {
        console.log(err);
        console.log(this.state.transactionId);
      });
  };

  renderProductList = () => {
    return this.state.productList.map((val, idx) => {
      return (
        <>
          <tr
            className="text-center"
            onClick={() => {
              console.log(idx, this.state.activeProducts.includes(idx));
              console.log(val);
              if (this.state.status == "pending") {
                if (this.state.activeProducts.includes(idx)) {
                  this.setState({
                    activeProducts: [
                      ...this.state.activeProducts.filter(
                        (item) => item !== idx
                      ),
                    ],
                  });
                } else {
                  this.setState({
                    activeProducts: [...this.state.activeProducts, idx],
                  });
                }
              } else if (this.state.status == "success") {
                if (this.state.activeProductsSuccess.includes(idx)) {
                  this.setState({
                    activeProductsSuccess: [
                      ...this.state.activeProductsSuccess.filter(
                        (item) => item !== idx
                      ),
                    ],
                  });
                } else {
                  this.setState({
                    activeProductsSuccess: [
                      ...this.state.activeProductsSuccess,
                      idx,
                    ],
                  });
                }
              } else if (this.state.status == "reject") {
                if (this.state.activeProductsReject.includes(idx)) {
                  this.setState({
                    activeProductsReject: [
                      ...this.state.activeProductsReject.filter(
                        (item) => item !== idx
                      ),
                    ],
                  });
                } else {
                  this.setState({
                    activeProductsReject: [
                      ...this.state.activeProductsReject,
                      idx,
                    ],
                  });
                }
              } else {
                if (this.state.activeProductsRejectP.includes(idx)) {
                  this.setState({
                    activeProductsRejectP: [
                      ...this.state.activeProductsRejectP.filter(
                        (item) => item !== idx
                      ),
                    ],
                  });
                } else {
                  this.setState({
                    activeProductsRejectP: [
                      ...this.state.activeProductsRejectP,
                      idx,
                    ],
                  });
                }
              }
            }}
          >
            <td> {idx + 1} </td>
            <td> {val.users.username} </td>
            <td>
              <span style={{ fontWeight: "normal" }}>
                {" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(val.totalPrice)}
              </span>
            </td>
            <td> {val.status}</td>
            <td>
              <ButtonUI
                onClick={(_) => this.checkBuktiHandler(val.buktiTrf)}
                type="contained"
              >
                Check Bukti Trf
              </ButtonUI>
            </td>
            <td> {val.checkoutTime}</td>
            {this.state.status == "success" ? <td> {val.acceptTime}</td> : null}
            {this.state.status == "reject" ? (
              <td> {val.tanggalReject}</td>
            ) : null}
            <center>
              <div className="row ml-5 justify-content-center">
                {this.state.status != "success" &&
                this.state.status != "rejectPermanent" ? (
                  <>
                    <ButtonUI
                      onClick={(_) => this.confirmBtnHandler(val.id)}
                      type="contained"
                    >
                      Confirm
                    </ButtonUI>

                    <ButtonUI
                      onClick={(_) => this.rejectBtnHandler(val.id)}
                      type="contained"
                    >
                      Reject
                    </ButtonUI>
                  </>
                ) : null}
              </div>
            </center>
          </tr>
          <>
            {val.transactionDetail.map((val, index) => {
              return (
                <tr
                  className={`collapse-item 
                  ${
                    this.state.status == "pending"
                      ? this.state.activeProducts.includes(idx)
                        ? "active"
                        : null
                      : this.state.status == "success"
                      ? this.state.activeProductsSuccess.includes(idx)
                        ? "active"
                        : null
                      : this.state.status == "reject"
                      ? this.state.activeProductsReject.includes(idx)
                        ? "active"
                        : null
                      : this.state.activeProductsRejectP.includes(idx)
                      ? "active"
                      : null
                  }`}
                >
                  <td colSpan={6}>
                    <div className="row col-12">
                      <div className="col-3 pt-2">
                        <img
                          src={val.concerts.concertImage}
                          alt=""
                          style={{ height: "120px", border: "1px solid black" }}
                        />
                      </div>
                      <div className="col-3 text-left">
                        <h6>No</h6>
                        <h6>Nama Product</h6>
                        <h6>Price</h6>
                        <h6>Quantity</h6>
                        <h6>Total Price</h6>
                      </div>
                      <div className="col-4 text-left">
                        <h6>
                          :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {index + 1}
                          </span>
                        </h6>
                        <h6>
                          :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {val.concerts.concertName}
                          </span>
                        </h6>
                        <h6>
                          :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {" "}
                            {val.quantity}
                          </span>{" "}
                        </h6>
                        <h6>
                          :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {" "}
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(val.totalPrice)}
                          </span>
                        </h6>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </>
        </>
      );
    });
  };

  render() {
    return (
      <>
        <div className="container py-4">
          <div className="dashboard">
            <caption className="p-3">
              <h2>Transaction</h2>
            </caption>
            <div className="d-flex justify-content-center">
              <ButtonUI
                className={`nav-atas-btn ${
                  this.state.status == "pending" ? "active" : null
                } `}
                type="outlined"
                onClick={() => this.getPaymentsList("pending")}
              >
                Pending
              </ButtonUI>
              <ButtonUI
                className={`nav-atas-btn ${
                  this.state.status == "success" ? "active" : null
                } ml-4`}
                type="outlined"
                onClick={() => this.getPaymentsList("success")}
              >
                Success
              </ButtonUI>
              <ButtonUI
                className={`nav-atas-btn ${
                  this.state.status == "reject" ? "active" : null
                } ml-4`}
                type="outlined"
                onClick={() => this.getPaymentsList("reject")}
              >
                Reject
              </ButtonUI>
            </div>
            <Table className="dashboard-table">
              <thead>
                <tr className="text-center ">
                  <th>No.</th>
                  <th>Username</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Bukti Trf</th>
                  <th>Date Transaksi</th>
                  {this.state.status == "success" ? (
                    <th>Date Transaksi Success</th>
                  ) : null}
                  {this.state.status == "reject" ? (
                    <th>Date Transaksi Reject</th>
                  ) : null}
                  {this.state.status != "success" &&
                  this.state.status != "rejectPermanent" ? (
                    <th>Action</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>{this.renderProductList()}</tbody>
            </Table>
          </div>
        </div>

        <Modal
          toggle={this.toggleModalCheck}
          isOpen={this.state.modalOpenCheck}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModalCheck}>
            <caption>
              <h3>Check Bukti Transfer</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="col-6 mt-3">
              <div className="col-12 text-center my-3">
                <img
                  src={this.state.buktiTrf}
                  alt=""
                  style={{ height: "120px" }}
                />
              </div>
            </div>

            <div className="d-flex flex-row py-5">
              <div className="col-5  offset-1">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModalCheck}
                  type="outlined"
                >
                  Cancel
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default AdminPayments;
