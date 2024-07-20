import ColumnListItem from "sap/m/ColumnListItem";
import Table from "sap/m/Table";
import Event from "sap/ui/base/Event";
import UIComponent from "sap/ui/core/UIComponent";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/Context";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

/**
 * @namespace at.clouddna.zsapui5withodatav2.controller
 */
export default class Main extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        
    }

    private onNavToDetail(oEvent: Event) {
        let oRouter = (this.getOwnerComponent() as UIComponent).getRouter(),
            oListItem = oEvent.getSource() as ColumnListItem,
            oSourceBinding = oListItem.getBindingContext() as Context,
            sPath = oSourceBinding.getPath();
        oRouter.navTo("Detail", {
            path: encodeURIComponent(sPath)
        });
    }    

    private dynamicFilterAndSorter(){
        let oTable = this.getView().byId("") as Table,
            oBinding = oTable.getBinding("items") as ListBinding,
            aFilter : Array<Filter> = [],
            aSorter : Array<Sorter> = [];

        //Werte dynamisch ermitteln und in das Filter-Array einfügen:
        let sRatingValue = 5;
        aFilter.push(new Filter("Rating", FilterOperator.EQ, sRatingValue));

        //Werte dynamisch ermitteln und in das Sorter-Array einfügen:
        aSorter.push(new Sorter("ISBN", true));

        oBinding.filter(aFilter);
        oBinding.sort(aSorter);
    }

    private onCreatePressed() {
        let oRouter = (this.getOwnerComponent() as UIComponent).getRouter(),
            oNewContext = (this.getView().getModel() as ODataModel).createEntry("/ZRAP_CV_BOOKS", {}) as any;
        oRouter.navTo("Create", {
            path: encodeURIComponent(oNewContext.getPath())
        });
    }
    
}