import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class AdminDashboard extends React.Component {
  state = {
    productList: [],
    createForm: {
      concertName: "",
      concertArtist: "",
      concertLocation: "",
      concertImage: "",
      concertDate: "",
      category: "girlgroup",
      vvipPrice: "",
      vvipCapacity: 0,
      vipPrice: "",
      vipCapacity: 0,
      regularPrice: "",
      regularCapacity: 0,
    },
    editForm: {
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
    activeProducts: [],
    modalOpen: false,
  };

  getProductList = () => {
    Axios.get(`${API_URL}/concert`)
      .then((res) => {
        this.setState({ productList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProductList = () => {
    return this.state.productList.map((val, idx) => {
      const { id, concertName, category, concertImage } = val;
      return (
        <>
          <tr
            onClick={() => {
              if (this.state.activeProducts.includes(idx)) {
                this.setState({
                  activeProducts: [
                    ...this.state.activeProducts.filter((item) => item !== idx),
                  ],
                });
              } else {
                this.setState({
                  activeProducts: [...this.state.activeProducts, idx],
                });
              }
            }}
          >
            <td> {id} </td>
            <td> {concertName} </td>
          </tr>
          <tr
            className={`collapse-item ${
              this.state.activeProducts.includes(idx) ? "active" : null
            }`}
          >
            <td className="" colSpan={3}>
              <div className="d-flex justify-content-around align-items-center">
                <div className="d-flex">
                  <img src={concertImage} alt="" />
                  <div className="d-flex flex-column ml-4 justify-content-center">
                    <h5>{concertName}</h5>
                    <h6 className="mt-2">
                      Category:
                      <span style={{ fontWeight: "normal" }}> {category}</span>
                    </h6>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <ButtonUI
                    onClick={(_) => this.editBtnHandler(idx)}
                    type="contained"
                  >
                    Edit
                  </ButtonUI>
                  <ButtonUI
                    onClick={() => this.deleteProductHandler(idx)}
                    className="mt-3"
                    type="textual"
                  >
                    Delete
                  </ButtonUI>
                </div>
              </div>
            </td>
          </tr>
        </>
      );
    });
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

  createProductHandler = () => {
    Axios.post(`${API_URL}/concert`, this.state.createForm)
      .then((res) => {
        swal("Success!", "Your item has been added to the list", "success");
        this.setState({
          createForm: {
            concertName: "",
            concertArtist: "",
            concertLocation: "",
            concertImage: "",
            concertDate: "",
            category: "girlgroup",
            image: "",
            vvipPrice: "",
            vvipCapacity: 0,
            vipPrice: "",
            vipCapacity: 0,
            regularPrice: "",
            regularCapacity: 0,
          },
        });
        this.getProductList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be added to the list", "error");
      });
  };

  editBtnHandler = (idx) => {
    this.setState({
      editForm: {
        ...this.state.productList[idx],
      },
      modalOpen: true,
    });
  };

  editProductHandler = () => {
    Axios.post(
      `${API_URL}/concert/${this.state.editForm.id}`,
      this.state.editForm
    )
      .then((res) => {
        swal("Success!", "Your item has been edited", "success");
        this.setState({ modalOpen: false });
        this.getProductList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be edited", "error");
        console.log(err);
      });
  };

  deleteProductHandler = (id) => {
    console.log(this.state.productList[id].id);
    Axios.delete(`${API_URL}/concert/${this.state.productList[id].id}`)
      .then((res) => {
        swal("Success!", "Your item has been deleted", "success");
        this.getProductList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be deleted", "error");
        console.log(err);
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getProductList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="dashboard">
          <caption className="p-3">
            <h2>Products</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>{this.renderProductList()}</tbody>
          </table>
        </div>
        <div className="dashboard-form-container p-4">
          <caption className="mb-4 mt-2">
            <h2>Add Product</h2>
          </caption>
          <div className="row">
            <div className="col-8">
              <TextField
                value={this.state.createForm.concertName}
                placeholder="Concert Name"
                onChange={(e) =>
                  this.inputHandler(e, "concertName", "createForm")
                }
              />
            </div>
            <div className="col-4">
              <TextField
                value={this.state.createForm.concertDate}
                placeholder="Date"
                type="date"
                onChange={(e) =>
                  this.inputHandler(e, "concertDate", "createForm")
                }
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.concertArtist}
                placeholder="Artist Name"
                onChange={(e) =>
                  this.inputHandler(e, "concertArtist", "createForm")
                }
              />
            </div>
            <div className="col-6 mt-3">
              <select
                value={this.state.createForm.category}
                className="custom-text-input h-100 pl-3"
                onChange={(e) => this.inputHandler(e, "category", "createForm")}
              >
                <option value="girlgroup">Girlgroup</option>
                <option value="boygroup">Boygroup</option>
              </select>
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.concertLocation}
                placeholder="Concert Location"
                onChange={(e) =>
                  this.inputHandler(e, "concertLocation", "createForm")
                }
              />
            </div>{" "}
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.concertImage}
                placeholder="Concert Image"
                onChange={(e) =>
                  this.inputHandler(e, "concertImage", "createForm")
                }
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.vvipPrice}
                placeholder="VVIP price"
                onChange={(e) =>
                  this.inputHandler(e, "vvipPrice", "createForm")
                }
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.vvipCapacity}
                placeholder="VVIP capacity"
                type="number"
                onChange={(e) =>
                  this.inputHandler(e, "vvipCapacity", "createForm")
                }
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.vipPrice}
                placeholder="VIP price"
                onChange={(e) => this.inputHandler(e, "vipPrice", "createForm")}
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.vipCapacity}
                placeholder="VIP capacity"
                type="number"
                onChange={(e) =>
                  this.inputHandler(e, "vipCapacity", "createForm")
                }
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.regularPrice}
                placeholder="Regular price"
                onChange={(e) =>
                  this.inputHandler(e, "regularPrice", "createForm")
                }
              />
            </div>
            <div className="col-6 mt-3">
              <TextField
                value={this.state.createForm.regularCapacity}
                placeholder="Regular capacity"
                type="number"
                onChange={(e) =>
                  this.inputHandler(e, "regularCapacity", "createForm")
                }
              />
            </div>
            <div className="col-12 mt-3 justify-content-center">
              <ButtonUI onClick={this.createProductHandler} type="contained">
                Add Concert
              </ButtonUI>
            </div>
          </div>
        </div>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit Concert</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-8">
                <TextField
                  value={this.state.editForm.concertName}
                  placeholder="Concert Name"
                  onChange={(e) =>
                    this.inputHandler(e, "concertName", "editForm")
                  }
                />
              </div>
              <div className="col-4">
                <TextField
                  value={this.state.editForm.concertDate}
                  placeholder="Date"
                  type="date"
                  onChange={(e) =>
                    this.inputHandler(e, "concertDate", "editForm")
                  }
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.concertArtist}
                  placeholder="Artist Name"
                  onChange={(e) =>
                    this.inputHandler(e, "concertArtist", "editForm")
                  }
                />
              </div>
              <div className="col-6 mt-3">
                <select
                  value={this.state.editForm.category}
                  className="custom-text-input h-100 pl-3"
                  onChange={(e) => this.inputHandler(e, "category", "editForm")}
                >
                  <option value="girlgroup">Girlgroup</option>
                  <option value="boygroup">Boygroup</option>
                </select>
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.concertLocation}
                  placeholder="Concert Location"
                  onChange={(e) =>
                    this.inputHandler(e, "concertLocation", "editForm")
                  }
                />
              </div>{" "}
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.concertImage}
                  placeholder="Concert Image"
                  onChange={(e) =>
                    this.inputHandler(e, "concertImage", "editForm")
                  }
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.vvipPrice}
                  placeholder="VVIP price"
                  onChange={(e) =>
                    this.inputHandler(e, "vvipPrice", "editForm")
                  }
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.vvipCapacity}
                  placeholder="VVIP capacity"
                  type="number"
                  onChange={(e) =>
                    this.inputHandler(e, "vvipCapacity", "editForm")
                  }
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.vipPrice}
                  placeholder="VIP price"
                  onChange={(e) => this.inputHandler(e, "vipPrice", "editForm")}
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.vipCapacity}
                  placeholder="VIP capacity"
                  type="number"
                  onChange={(e) =>
                    this.inputHandler(e, "vipCapacity", "editForm")
                  }
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.regularPrice}
                  placeholder="Regular price"
                  onChange={(e) =>
                    this.inputHandler(e, "regularPrice", "editForm")
                  }
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.regularCapacity}
                  placeholder="Regular capacity"
                  type="number"
                  onChange={(e) =>
                    this.inputHandler(e, "regularCapacity", "editForm")
                  }
                />
              </div>
              <div className="col-12 text-center my-3">
                <img src={this.state.editForm.concertImage} alt="" />
              </div>
              <div className="col-5 mt-3 offset-1">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </ButtonUI>
              </div>
              <div className="col-5 mt-3">
                <ButtonUI
                  className="w-100"
                  onClick={this.editProductHandler}
                  type="contained"
                >
                  Save
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default AdminDashboard;
