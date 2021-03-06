import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, reset } from "redux-form";
import _ from "lodash";
import { Button, Modal } from "reactstrap";
import { Tabs, Tab } from "react-bootstrap";
import { BaseComponent } from "../../Common/base-component";
import {
  COMMON_FAIL_MESSAGE,
  LABEL_POSITION_TOP,
  validateEmail,
  validatePhoneNumbers,
  validateAadhaarNumber,
  BASE_IMAGES_URL,
} from "../../Common/constant";
import {
  openCustomerCreateModal,
  addCustomer,
  editCustomerSave,
  customerKycFiles,
} from "../action";
import { showSuccess, showError } from "../../Common/errorbar";
import LocaleStrings from "../../../languages";
import ImagesDrop from "../../Common/image-upload";
import ImageCropper from "../../Common/uploader-image-cropper";
import UploadIcon from "../../../assets/img/icons/picture.png";

class AddCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, selectedTab: 1 };
  }

  componentDidMount() {}

  closeModal = () => {
    this.props.openCustomerCreateModal({ showModal: false, selectedTab: 1 });
  };

  handleSelect = (key) => {
    this.setState({ selectedTab: key });
  };

  onSubmitForm = (values) => {
    let { editMode, session } = this.props;

    this.setState({ loading: true });
    if (!editMode) {
      this.props.addCustomer(session, values, (response) => {
        if (response.success == 1) {
          this.props.showSuccess(LocaleStrings.customers_add_form_success);
          this.props.finishOperationsCallback();
          this.closeModal();
        } else if (response.success == 2) {
          this.setState({ loading: false });
          let message = COMMON_FAIL_MESSAGE;
          if (response.data.email != "") {
            message = response.data.email;
          }
          if (response.data.firstname != "") {
            message = response.data.firstname;
          }
          if (response.data.lastname != "") {
            message = response.data.lastname;
          }
          if (response.data.mobile != "") {
            message = response.data.mobile;
          }
          if (response.data.aadhaarnumber != "") {
            message = response.data.aadhaarnumber;
          }

          this.props.showError(message);
        } else {
          this.setState({ loading: false });
          this.props.showError(COMMON_FAIL_MESSAGE);
        }
      });
    } else {
      this.props.editCustomerSave(session, values, (response) => {
        if (response.success == 1) {
          this.props.showSuccess(LocaleStrings.customers_edit_form_success);
          this.props.finishOperationsCallback();
          this.closeModal();
        } else if (response.success == 2) {
          this.setState({ loading: false });
          let message = COMMON_FAIL_MESSAGE;
          if (response.data.email != "") {
            message = response.data.email;
          }
          if (response.data.firstname != "") {
            message = response.data.firstname;
          }
          if (response.data.lastname != "") {
            message = response.data.lastname;
          }
          if (response.data.mobile != "") {
            message = response.data.mobile;
          }
          if (response.data.aadhaarnumber != "") {
            message = response.data.aadhaarnumber;
          }

          this.props.showError(message);
        } else {
          this.setState({ loading: false });
          this.props.showError(COMMON_FAIL_MESSAGE);
        }
      });
    }
  };

  render() {
    var {
      modalStatus,
      editMode,
      handleSubmit,
      pristine,
      reset,
      submitting,
      invalid,
    } = this.props;
    var edit = editMode;
    let spinner = this.state.loading ? "fas fa-spinner fa-pulse" : "";
    let disabled = this.state.loading ? true : false;

    return (
      <Modal className="" isOpen={modalStatus.showModal == true ? true : false}>
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            {" "}
            {edit
              ? LocaleStrings.customers_madal_title_edit
              : LocaleStrings.customers_madal_title_add}
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => this.closeModal()}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <hr />
        <form
          onSubmit={handleSubmit(this.onSubmitForm)}
          encType="multipart/form-data"
        >
          <div className="modal-body">
            <Tabs
              className="customer-add-tabs mt-0"
              id="customer-tab"
              activeKey={this.state.selectedTab}
              onSelect={this.handleSelect}
            >
              <Tab
                className="pt-3"
                eventKey={1}
                title={LocaleStrings.customers_madal_tab_text_basic_details}
              >
                <CustomerForm {...this.props} />
              </Tab>
              <Tab
                className="pt-3"
                eventKey={2}
                title={LocaleStrings.customers_madal_tab_text_others_details}
              >
                <OthersForm {...this.props} />
              </Tab>
              <Tab
                className="pt-3"
                eventKey={3}
                title={LocaleStrings.customers_madal_tab_text_docs_details}
              >
                <KYCFileUpload {...this.props} />
              </Tab>
            </Tabs>
          </div>
          <div className="modal-footer">
            <Button color="secondary" onClick={this.closeModal}>
              {LocaleStrings.button_close}
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={pristine || invalid || submitting || disabled}
            >
              <i className={spinner} aria-hidden="true"></i>{" "}
              {LocaleStrings.button_save}
            </Button>
          </div>
        </form>
      </Modal>
    );
  }
}

function validate(values, ownProps) {
  // console.log('values : - ', values)
  let errors = {};
  var createdby = values["createdby"];
  var firstname = values["firstname"];
  var lastname = values["lastname"];
  var email = values["email"];
  var mobile = values["mobile"];
  var aadhaarnumber = values["aadhaarnumber"];

  if (!createdby || createdby === "") {
    errors["createdby"] = LocaleStrings.required;
  }

  if (!firstname || firstname.trim() === "") {
    errors["firstname"] = LocaleStrings.required;
  }

  if (!lastname || lastname.trim() === "") {
    errors["lastname"] = LocaleStrings.required;
  }

  if (email && !validateEmail(email)) {
    errors["email"] = LocaleStrings.agents_validation_invalid_email;
  }

  if (!mobile || mobile.trim() === "") {
    errors["mobile"] = LocaleStrings.required;
  }
  if (mobile && !validatePhoneNumbers(mobile)) {
    errors["mobile"] = LocaleStrings.agents_validation_invalid_mobile_number;
  }

  if (!aadhaarnumber || aadhaarnumber.trim() === "") {
    errors["aadhaarnumber"] = LocaleStrings.required;
  }
  if (aadhaarnumber && !validateAadhaarNumber(aadhaarnumber)) {
    errors["aadhaarnumber"] =
      LocaleStrings.customers_validation_invalid_aadhaar_number;
  }

  _.map(ownProps.customerKYCFiles, (form, index) => {
    var formKey = form.key;
    if (!values[formKey] || values[formKey].trim() === "") {
      errors[formKey] = LocaleStrings.required;
    }
  });

  // console.log("values :- ", values);
  // console.log("errors :- ", errors);
  return errors;
}

function mapStateToProps(state, ownProps) {
  // var edit = false;
  var edit = !_.isEmpty(state.editCustomer);
  var initVals =
    ownProps.callfrom === "agent"
      ? { createdby: ownProps.selectedAgent.agentDetails.agentid }
      : {};

  if (edit) {
    initVals = state.editCustomer;
  }

  return {
    session: state.session,
    modalStatus: state.customerCreateModal,
    customerKYCFiles: state.customerKYCFiles,
    editMode: edit,
    initialValues: initVals,
    allAgents: state.allAgentsList,
  };
}

export default connect(mapStateToProps, {
  showSuccess,
  showError,
  openCustomerCreateModal,
  addCustomer,
  editCustomerSave,
  customerKycFiles,
})(
  reduxForm({
    validate,
    form: "CustomerForm",
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
  })(AddCustomer)
);

class CustomerForm extends BaseComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  handleAadhaar = (e) => {
    var value = e.target.value;

    value = value
      .replace(/\D/g, "")
      .split(/(?:([\d]{4}))/g)
      .filter((s) => s.length > 0)
      .join(" ");
    this.props.autofill("aadhaarnumber", value);
  };

  renderFieldTextAadhaar(field) {
    var labelposition = field.labelposition;
    var divClassName = `form-group row ${
      field.meta.touched && field.meta.error ? "has-danger" : ""
    }`;
    var labelClasses = "custom-label col-sm-3";
    var inputClasses = "col-sm-9 col-sm-offset-0";

    if (labelposition === LABEL_POSITION_TOP) {
      labelClasses = "custom-label col-sm-12";
      inputClasses = "col-sm-12 col-sm-offset-0";
    }

    return (
      <div className={divClassName}>
        <label className={labelClasses}>
          {field.label}
          <span>{field.mandatory === "true" ? "*" : ""}</span>
        </label>

        <div className={inputClasses}>
          <input
            className="form-control"
            type={field.type}
            placeholder={field.placeholder}
            {...field.input}
            maxLength={field.maxlength ? field.maxlength : ""}
            disabled={field.disabled ? true : false}
            onKeyUp={field.onKeyUp}
          />

          <div className="text-help label-text-help">
            {field.meta.touched ? field.meta.error : ""}
          </div>
        </div>
      </div>
    );
  }

  render() {
    let { allAgents } = this.props;
    let agentOptions = [];

    _.map(allAgents.data, (item, index) => {
      var obj = { label: `${item.fullname}`, value: item.agentid.toString() };
      agentOptions.push(obj);
    });

    return (
      <div>
        <Field
          name="createdby"
          label={LocaleStrings.customers_add_form_label_user_agent}
          placeholder={LocaleStrings.customers_add_form_ph_user_agent}
          component={this.renderFieldSelect}
          mandatory="true"
          opts={agentOptions}
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="email"
          label={LocaleStrings.customers_add_form_label_email}
          placeholder={LocaleStrings.customers_add_form_ph_email}
          type="email"
          component={this.renderFieldText}
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="firstname"
          label={LocaleStrings.customers_add_form_label_firstname}
          placeholder={LocaleStrings.customers_add_form_ph_firstname}
          type="text"
          component={this.renderFieldText}
          mandatory="true"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="lastname"
          label={LocaleStrings.customers_add_form_label_lastname}
          placeholder={LocaleStrings.customers_add_form_ph_lastname}
          type="text"
          component={this.renderFieldText}
          mandatory="true"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="mobile"
          label={LocaleStrings.customers_add_form_label_mobile}
          placeholder={LocaleStrings.customers_add_form_ph_mobile}
          type="text"
          component={this.renderFieldText}
          mandatory="true"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="aadhaarnumber"
          label={LocaleStrings.customers_add_form_label_aadhaarno}
          placeholder={LocaleStrings.customers_add_form_ph_aadhaarno}
          type="text"
          component={this.renderFieldTextAadhaar}
          mandatory="true"
          labelposition={LABEL_POSITION_TOP}
          onKeyUp={this.handleAadhaar}
          maxlength={14}
        />
      </div>
    );
  }
}

class OthersForm extends BaseComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Field
          name="address1"
          label={LocaleStrings.customers_add_form_label_address1}
          placeholder={LocaleStrings.customers_add_form_ph_address1}
          type="text"
          component={this.renderFieldText}
          mandatory="false"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="address2"
          label={LocaleStrings.customers_add_form_label_address2}
          placeholder={LocaleStrings.customers_add_form_ph_address2}
          type="text"
          component={this.renderFieldText}
          mandatory="false"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="city"
          label={LocaleStrings.customers_add_form_label_city}
          placeholder={LocaleStrings.customers_add_form_ph_city}
          type="text"
          component={this.renderFieldText}
          mandatory="false"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="state"
          label={LocaleStrings.customers_add_form_label_state}
          placeholder={LocaleStrings.customers_add_form_ph_state}
          type="text"
          component={this.renderFieldText}
          mandatory="false"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="pincode"
          label={LocaleStrings.customers_add_form_label_pin}
          placeholder={LocaleStrings.customers_add_form_ph_pin}
          type="number"
          component={this.renderFieldText}
          mandatory="false"
          labelposition={LABEL_POSITION_TOP}
        />
      </div>
    );
  }
}
class KYCFileUpload extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { fileChanged: true };
  }

  onFilesDrop = (index, files) => {
    let { customerKYCFiles } = this.props;

    // console.log("files :- ", files);
    // console.log("index :- ", index);
    // console.log("customerKYCFiles :- ", customerKYCFiles);

    customerKYCFiles[index].file = files ? files : "";
    customerKYCFiles[index].filename = files
      ? `${customerKYCFiles[index].key}.png`
      : "";

    // console.log("customerKYCFiles after : - ", customerKYCFiles);
    this.props.customerKycFiles(customerKYCFiles);
    this.props.autofill(customerKYCFiles[index].key, files);
  };

  onFileAvailable = (available) => {
    this.setState({ fileChanged: !this.state.fileChanged });
  };

  otherFiles = () => {
    let { customerKYCFiles } = this.props;
    // console.log('customerKYCFiles : - ', customerKYCFiles)

    return _.map(customerKYCFiles, (item, index) => {
      // console.log('index :- ', index);
      var filePreview = "";
      var fileName = "";
      var fileOld = false;

      if (item && item.file && item.file != "") {
        var file = item.file;
        fileName = item.filename;
        filePreview = `${BASE_IMAGES_URL}/${file}`;
        fileOld = true;
        var n = file.search(";base64,");
        if (n > 0) {
          filePreview = `${file}`;
          fileOld = false;
        }
      }

      return (
        <div className={`${item.key} row m-0`} key={`key-${index}`}>
          <label className="col-md-12 p-0 custom-label">
            {item.label}
            <span>*</span>
          </label>
          <div className="col-md-12 p-0">
            <ImageCropper
              displaySize={
                item.key === "userpic"
                  ? { width: 170, height: 170 }
                  : { width: 350, height: 200 }
              } // For image display style
              requiredSize={
                item.key === "userpic"
                  ? { width: 200, height: 200 }
                  : { width: 450, height: 300 }
              } // For image size required validation
              cropperSize={
                item.key === "userpic"
                  ? { width: 120, height: 120 }
                  : { width: 400, height: 250 }
              } // Cropper display size. Note its add 50px for padding
              onImageSave={this.onFilesDrop.bind(this, index)}
              onImageChange={this.onFileAvailable}
              imagepath={filePreview}
              imageType="jpg"
              className="drop-zone-area-custom-image"
              insideImage={UploadIcon}
              insideImageStyle={
                item.key === "userpic"
                  ? {
                      width: 25,
                      height: 25,
                      margin: "25px 0px 5px",
                    }
                  : {
                      width: 25,
                      height: 25,
                      margin: "50px 0px 5px",
                    }
              }
              insideText={
                item.key === "userpic"
                  ? "Drag and Drop or Click here to upload image. Image size must be 200x200 px."
                  : "Drag and Drop or Click here to upload image. Image size must be 450x300 px."
              }
            />
            <Field
              name={item.key}
              type="text"
              component={this.renderHiddenFieldTextShowError}
            />
          </div>
        </div>
      );
    });
  };

  render() {
    return <div className="customer-kyc-section">{this.otherFiles()}</div>;
  }
}
