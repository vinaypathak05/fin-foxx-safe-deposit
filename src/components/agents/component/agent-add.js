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
  BASE_IMAGES_URL,
} from "../../Common/constant";
import { openAgentCreateModal, agentKycFiles, addAgent } from "../action";
import { showSuccess, showError } from "../../Common/errorbar";
import LocaleStrings from "../../../languages";
import ImagesDrop from "../../Common/image-upload";
import UploadIcon from "../../../assets/img/icons/picture.png";

class AddAgent extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, selectedTab: 1 };
  }

  componentDidMount() {}

  closeModal = () => {
    this.props.openAgentCreateModal({ showModal: false, selectedTab: 1 });
  };

  handleSelect = (key) => {
    this.setState({ selectedTab: key });
  };

  onSubmitForm = (values) => {
    let { editMode, session } = this.props;
    // console.log('Values: -', values)

    if (!editMode) {
      this.setState({ loading: true });
      this.props.addAgent(session, values, (response) => {
        if (response.success == 1) {
          this.props.showSuccess(LocaleStrings.agents_add_form_success);
          this.props.finishOperationsCallback();
          this.closeModal();
        } else if (response.success == 2) {
          this.setState({ loading: false });
          let message = COMMON_FAIL_MESSAGE;
          if (response.data.email != "") {
            message = response.data.email;
          } else if (response.data.mobile != "") {
            message = response.data.mobile;
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

    return (
      <Modal className="" isOpen={modalStatus.showModal == true ? true : false}>
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            {" "}
            {edit
              ? LocaleStrings.agents_madal_title_edit
              : LocaleStrings.agents_madal_title_add}
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
              className="branding-tabs mt-0"
              id="speaker-from-tab"
              activeKey={this.state.selectedTab}
              onSelect={this.handleSelect}
            >
              <Tab
                className="pt-3"
                eventKey={1}
                title={LocaleStrings.agents_madal_tab_text_basic_details}
              >
                <AgentForm {...this.props} />
              </Tab>
              <Tab
                className="pt-3"
                eventKey={2}
                title={LocaleStrings.agents_madal_tab_text_bank_details}
              >
                <BankForm {...this.props} />
              </Tab>
              <Tab
                className="pt-3"
                eventKey={3}
                title={LocaleStrings.agents_madal_tab_text_docs_details}
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
              disabled={pristine || invalid || submitting}
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

function validate(values) {
  // console.log('values : - ', values)
  let errors = {};
  var firstname = values["firstname"];
  var lastname = values["lastname"];
  var email = values["email"];
  var mobile = values["mobile"];
  var password = values["password"];
  var agentpic = values["agentpic"];
  var aadhaarfrontpic = values["aadhaarfrontpic"];
  var aadhaarbackpic = values["aadhaarbackpic"];

  if (!firstname || firstname.trim() === "") {
    errors["firstname"] = LocaleStrings.required;
  }

  if (!lastname || lastname.trim() === "") {
    errors["lastname"] = LocaleStrings.required;
  }

  if (!email || email.trim() === "") {
    errors["email"] = LocaleStrings.required;
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
  if (!password || password.trim() === "") {
    errors["password"] = LocaleStrings.required;
  }
  if (password && password.trim().length < 8) {
    errors["password"] = LocaleStrings.agents_validation_invalid_min_password;
  }

  if (!agentpic || agentpic.trim() === "") {
    errors["agentpic"] = LocaleStrings.required;
  }
  if (!aadhaarfrontpic || aadhaarfrontpic.trim() === "") {
    errors["aadhaarfrontpic"] = LocaleStrings.required;
  }
  if (!aadhaarbackpic || aadhaarbackpic.trim() === "") {
    errors["aadhaarbackpic"] = LocaleStrings.required;
  }

  return errors;
}

function mapStateToProps(state) {
  var edit = false;
  var initVals = {};

  return {
    session: state.session,
    modalStatus: state.agentCreateModal,
    uploadedAgentKycFiles: state.uploadedAgentKycFiles,
    editMode: edit,
    initialValues: initVals,
  };
}

export default connect(mapStateToProps, {
  openAgentCreateModal,
  agentKycFiles,
  addAgent,
  showSuccess,
  showError,
})(
  reduxForm({
    validate,
    form: "AgentForm",
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
  })(AddAgent)
);

class AgentForm extends BaseComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Field
          name="email"
          label={LocaleStrings.agents_add_form_label_email}
          placeholder={LocaleStrings.agents_add_form_ph_email}
          type="email"
          component={this.renderFieldText}
          mandatory="true"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="firstname"
          label={LocaleStrings.agents_add_form_label_firstname}
          placeholder={LocaleStrings.agents_add_form_ph_firstname}
          type="text"
          component={this.renderFieldText}
          mandatory="true"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="lastname"
          label={LocaleStrings.agents_add_form_label_lastname}
          placeholder={LocaleStrings.agents_add_form_ph_lastname}
          type="text"
          component={this.renderFieldText}
          mandatory="true"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="mobile"
          label={LocaleStrings.agents_add_form_label_mobile}
          placeholder={LocaleStrings.agents_add_form_ph_mobile}
          type="text"
          component={this.renderFieldText}
          mandatory="true"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="password"
          label={LocaleStrings.agents_add_form_label_password}
          placeholder={LocaleStrings.agents_add_form_ph_password}
          type="password"
          component={this.renderFieldText}
          mandatory="true"
          labelposition={LABEL_POSITION_TOP}
        />
      </div>
    );
  }
}

class BankForm extends BaseComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Field
          name="bankname"
          label={LocaleStrings.agents_add_form_label_bank_name}
          placeholder={LocaleStrings.agents_add_form_ph_bank_name}
          type="text"
          component={this.renderFieldText}
          mandatory="false"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="bankaccount"
          label={LocaleStrings.agents_add_form_label_account_number}
          placeholder={LocaleStrings.agents_add_form_ph_account_number}
          type="text"
          component={this.renderFieldText}
          mandatory="false"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="bankbranch"
          label={LocaleStrings.agents_add_form_label_bank_branch}
          placeholder={LocaleStrings.agents_add_form_ph_bank_branch}
          type="text"
          component={this.renderFieldText}
          mandatory="false"
          labelposition={LABEL_POSITION_TOP}
        />
        <Field
          name="bankifsc"
          label={LocaleStrings.agents_add_form_label_ifsc}
          placeholder={LocaleStrings.agents_add_form_ph_ifsc}
          type="text"
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
    let { uploadedAgentKycFiles } = this.props;

    // console.log('files :- ', files)
    // console.log('index :- ', index)
    // console.log('uploadedAgentKycFiles :- ', uploadedAgentKycFiles)

    uploadedAgentKycFiles[index].file = files.file ? files.file : "";
    uploadedAgentKycFiles[index].filename = files.filename
      ? files.filename
      : "";

    // console.log('uploadedAgentKycFiles : - ', uploadedAgentKycFiles)
    this.props.agentKycFiles(uploadedAgentKycFiles);

    this.props.autofill(uploadedAgentKycFiles[index].key, files.file);
  };

  onFileAvailable = (available) => {
    this.setState({ fileChanged: !this.state.fileChanged });
  };

  otherFiles = () => {
    let { uploadedAgentKycFiles } = this.props;
    // console.log('uploadedAgentKycFiles : - ', uploadedAgentKycFiles)

    return _.map(uploadedAgentKycFiles, (item, index) => {
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
        <>
          <ImagesDrop
            key={`key-${index}`}
            label={item.label}
            width={350}
            height="auto"
            onFileSave={this.onFilesDrop.bind(this, index)}
            filepath={filePreview}
            onFileChnageLocally={this.onFileAvailable}
            fileName={fileName}
            fileOld={fileOld}
            className="content-files-dropbox"
            innerText={
              <div className="content-files-drop-text">
                <div>
                  <img src={`${UploadIcon}`} />
                </div>
                <div>
                  {LocaleStrings.drag_and_drop} <br />
                  {LocaleStrings.or}{" "}
                  <span className="select-file">
                    {LocaleStrings.select_file}
                  </span>
                </div>
              </div>
            }
          />
          <Field
            name={item.key}
            type="text"
            component={this.renderHiddenFieldTextShowError}
          />
        </>
      );
    });
  };

  render() {
    return (
      <div className="dashboard-inside-container">
        <div className="row">{this.otherFiles()}</div>
      </div>
    );
  }
}
