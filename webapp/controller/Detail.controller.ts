import MessageBox, { Action } from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import Page from "sap/m/Page";
import Event from "sap/ui/base/Event";
import Fragment from "sap/ui/core/Fragment";
import UIComponent from "sap/ui/core/UIComponent";
import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace at.clouddna.zsapui5withodatav2.controller
 */
export default class Detail extends Controller {

    private aFragments : any = {};
    private oEditModel: JSONModel;

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        let oOwnerComponent = this.getOwnerComponent() as UIComponent;
        oOwnerComponent.getRouter().getRoute("Detail").attachPatternMatched(this.onPatternMatched,this);
        oOwnerComponent.getRouter().getRoute("Create").attachPatternMatched(this.onCreatePatternMatched,this);
    }

    private onPatternMatched(oEvent: Event){
        let oArguments = (oEvent.getParameters() as any).arguments,
            sPath = decodeURIComponent(oArguments.path);
        this.getView().bindElement(sPath);
        this.oEditModel = new JSONModel({
            editMode: false,
            create: false
        });
        this.getView().setModel(this.oEditModel, "editModel");
        this._loadFragment("Display");
    }
    
    private _loadFragment(sFragmentName: string) {
        debugger;
        let oPage = (this.getView().byId("page") as Page);
        oPage.removeAllContent();
        if (this.aFragments[sFragmentName]) {
            oPage.addContent(this.aFragments[sFragmentName]);
        } else {
            Fragment.load({
                id: Fragment.createId(this.getView().getId(), sFragmentName),
                name: "at.clouddna.zsapui5withodatav2.view.fragment." + sFragmentName,
                type: "XML",
                controller: this
            }).then((oFragment: any) => {
                this.aFragments[sFragmentName] = oFragment;
                oPage.addContent(oFragment);
            });
        }
    }

    private onEditPressed() {
        this._onSwitchEdit();
    }
    
    private _onSwitchEdit() {
        let bNewMode = !this.oEditModel.getProperty("/editMode");
        this.oEditModel.setProperty("/editMode", bNewMode);
        this._loadFragment(bNewMode ? "Edit" : "Display");
    }

    private onCreatePatternMatched(oEvent: Event){
        let oArguments = (oEvent.getParameters() as any).arguments,
            sPath = decodeURIComponent(oArguments.path);
        this.getView().bindElement(sPath);
        this.oEditModel = new JSONModel({
            editMode: true,
            create: true
        });
        this.getView().setModel(this.oEditModel, "editModel");
        this._loadFragment("Edit");
    }    

    private onDeletePressed() {
        let sPath = this.getView().getElementBinding().getPath(),
            i18nModel = this.getView().getModel("i18n"),
            oResourceBundle = (i18nModel as any).getResourceBundle(),
            sText = oResourceBundle.getText("deleteQuestion");
        MessageBox.confirm(sText, {
            actions: [Action.YES, Action.NO],
            emphasizedAction: Action.YES,
            onClose: (sAction: string) => {
                if (Action.YES === sAction) {
                    (this.getView().getModel() as ODataModel).remove(sPath, {
                        success: () => {
                            this.onNavBack();
                        },
                        error: (oError: any) => {
                            MessageBox.error("Ein unerwarteter Fehler ist aufgetreten!");
                        }
                    });
                }
            }
        });
    }
    
    private onNavBack () {
        let oHistory = History.getInstance(),
            sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
            window.history.go(-1);
        } else {
            let oRouter = (this.getOwnerComponent() as UIComponent).getRouter();
            oRouter.navTo("Main", {}, undefined, true);
        }
    }    

    private onCancelPressed() {
        let oEditModel = (this.getView().getModel("editModel") as JSONModel).getData();
        (this.getView().getModel() as ODataModel).resetChanges().then(() => {
            this._onSwitchEdit();
            if(oEditModel.create){
                this.onNavBack();
            }
        });
    }    

    private onSavePressed(){
        let oEditModel = (this.getView().getModel("editModel") as JSONModel).getData();
        (this.getView().getModel() as ODataModel).submitChanges({
            success: (oCreatedData: any) => {
                MessageToast.show("Erfolgreich gespeichert!");
                this._onSwitchEdit();
                if(oEditModel.create){
                    this.onNavBack();
                }
            },
            error: (oError: any) => {
                MessageBox.error("Ein unerwarteter Fehler ist aufgetreten!");
            }
        });
    }

}