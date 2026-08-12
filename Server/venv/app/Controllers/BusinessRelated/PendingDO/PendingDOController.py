import traceback
from flask import jsonify, request
from app import app, db
import os
from sqlalchemy import text

API_URL = os.getenv('API_URL')


@app.route(API_URL + "/get-pending-delivery-orders", methods=["GET"])
def get_pending_delivery_orders():
    try:
        query = text("""
            SELECT
                pendingDoid, tenderdetailid, tenderid, ebuyUserID,
                company_code, DOc_Date, Sauda_Date, Lifting_Date,
                Grade, Season, Sale_Rate, Purchase_Quintal,
                Lifting_Quintal, Adj_Quintal, Amount, Narration,
                BillTo_Ac_Code, BillTo_Accoid, ShipTo_Ac_Code, ShipTo_Accoid,
                Created_Date, gradeid, gradeCode, MillRate, TruckNo,
                DriverMobileNo, Item_Code, ic, Gst_Code,
                Mill_Code, mc, Approved, Year_Code
            FROM dbo.nt_1_PendingDeliveryOrder
            ORDER BY Created_Date DESC
        """)
        rows = db.session.execute(query).fetchall()
        data = [dict(row._mapping) for row in rows]
        return jsonify({"pending_orders": data}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@app.route(API_URL + "/getByPendingDOId", methods=["GET"])
def getByPendingDOId():
    try:
        tenderdetailid = request.args.get('tenderdetailid')
        if tenderdetailid is None:
            return jsonify({'error': 'Missing tenderdetailid parameter'}), 400
        try:
            tenderdetailid = int(tenderdetailid)
        except ValueError:
            return jsonify({'error': 'Invalid tenderdetailid parameter'}), 400

        query = text("""
            SELECT
                pendingDoid, tenderdetailid, tenderid, ebuyUserID,
                company_code, DOc_Date, Sauda_Date, Lifting_Date,
                Grade, Season, Sale_Rate, Purchase_Quintal,
                Lifting_Quintal, Adj_Quintal, Amount, Narration,
                BillTo_Ac_Code, BillTo_Accoid, ShipTo_Ac_Code, ShipTo_Accoid,
                Created_Date, gradeid, gradeCode, MillRate, TruckNo,
                DriverMobileNo, Item_Code, ic, Gst_Code,
                Mill_Code, mc, Approved, Year_Code,
                pendingDoid AS orderid
            FROM dbo.nt_1_PendingDeliveryOrder
            WHERE tenderdetailid = :tenderdetailid
        """)
        row = db.session.execute(query, {'tenderdetailid': tenderdetailid}).fetchone()
        if row is None:
            return jsonify({'error': 'Record not found'}), 404
        return jsonify({"last_head_data": dict(row._mapping)}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@app.route(API_URL + "/getdata-Pending_DO", methods=["GET"])
def getdata_Pending_DO():
    try:
        company_code = request.args.get('company_code')
        if not company_code:
            return jsonify({"error": "Missing company_code parameter"}), 400

        query = text("""
            SELECT TOP (100) PERCENT
                dbo.qrytenderdobalanceview.Tender_No,
                dbo.qrytenderdobalanceview.Tender_DateConverted  AS Tender_Date,
                dbo.qrytenderdobalanceview.buyername             AS Party2,
                dbo.qrytenderdobalanceview.buyerpartyname        AS Party,
                dbo.qrytenderdobalanceview.Mill_Rate,
                ISNULL(CONVERT(NVARCHAR(200), dbo.qrytenderdobalanceview.Grade), N'') +
                    CASE WHEN NULLIF(CONVERT(NVARCHAR(200), dbo.nt_1_systemmaster.System_Name_E), N'') IS NULL
                         THEN N''
                         ELSE N' - ' + CONVERT(NVARCHAR(200), dbo.nt_1_systemmaster.System_Name_E)
                    END                                          AS Grade,
                dbo.qrytenderdobalanceview.Sale_Rate,
                dbo.qrytenderdobalanceview.Buyer_Quantal,
                dbo.qrytenderdobalanceview.DESPATCH,
                dbo.qrytenderdobalanceview.BALANCE,
                dbo.qrytenderdobalanceview.tenderdoname          AS doname,
                dbo.qrytenderdobalanceview.Lifting_DateConverted AS Lifting_Date,
                dbo.qrytenderdobalanceview.ID,
                dbo.qrytenderdobalanceview.tenderdetailid,
                dbo.qrytenderdobalanceview.tenderid,
                dbo.qrytenderdobalanceview.Delivery_Type,
                dbo.qrytenderdobalanceview.shiptoname,
                dbo.qrytenderdobalanceview.tenderdoshortname,
                dbo.qrytenderdobalanceview.season,
                ISNULL(dbo.qrytenderdobalanceview.Purchase_Rate,
                       dbo.qrytenderdobalanceview.Party_Bill_Rate) AS Party_Bill_Rate,
                dbo.qrytenderdobalanceview.gradeid,
                dbo.qrytenderdobalanceview.gradeCode,
                CASE WHEN dbo.qrytenderdobalanceview.MillRate = 0
                     THEN dbo.qrytenderdobalanceview.Mill_Rate
                     ELSE dbo.qrytenderdobalanceview.MillRate
                END                                              AS MillRate,
                dbo.qrytenderdobalanceview.millshortname,
                dbo.qrytenderdobalanceview.Lifting_Date          AS LiftingDate,
                -- From PendingDeliveryOrder (only what is needed):
                dbo.nt_1_PendingDeliveryOrder.Purchase_Quintal,
                dbo.nt_1_PendingDeliveryOrder.Lifting_Quintal,
                dbo.nt_1_PendingDeliveryOrder.BillTo_Ac_Code,
                dbo.nt_1_PendingDeliveryOrder.BillTo_Accoid,
                dbo.nt_1_PendingDeliveryOrder.ShipTo_Ac_Code,
                dbo.nt_1_PendingDeliveryOrder.ShipTo_Accoid,
                dbo.nt_1_PendingDeliveryOrder.Created_Date,
                dbo.nt_1_PendingDeliveryOrder.TruckNo,
                dbo.nt_1_PendingDeliveryOrder.DriverMobileNo,
                dbo.nt_1_PendingDeliveryOrder.Approved,
                dbo.nt_1_PendingDeliveryOrder.doid       AS pending_doid,
                dbo.nt_1_PendingDeliveryOrder.do_no      AS pending_do_no,
                dbo.nt_1_PendingDeliveryOrder.Narration  AS Note,
                billTo.Ac_Name_E                                 AS BillTo_Name,
                shipTo.Ac_Name_E                                 AS ShipTo_Name,
                dbo.nt_1_PendingDeliveryOrder.pendingDoid
            FROM dbo.qrytenderdobalanceview
            INNER JOIN dbo.nt_1_PendingDeliveryOrder
                ON dbo.qrytenderdobalanceview.tenderdetailid = dbo.nt_1_PendingDeliveryOrder.tenderdetailid
            LEFT OUTER JOIN dbo.nt_1_systemmaster
                ON dbo.qrytenderdobalanceview.gradeid = dbo.nt_1_systemmaster.systemid
            LEFT JOIN dbo.nt_1_accountmaster billTo
                ON dbo.nt_1_PendingDeliveryOrder.BillTo_Ac_Code = billTo.Ac_Code
            LEFT JOIN dbo.nt_1_accountmaster shipTo
                ON dbo.nt_1_PendingDeliveryOrder.ShipTo_Ac_Code = shipTo.Ac_Code
            WHERE (dbo.qrytenderdobalanceview.BALANCE <> 0) AND Approved != 'Y' And isDeleted != '1' And isLocked != '1'
              AND (dbo.qrytenderdobalanceview.Company_Code = :company_code)
            ORDER BY dbo.qrytenderdobalanceview.Tender_No DESC
        """)
        rows = db.session.execute(query, {'company_code': company_code}).fetchall()
        return jsonify({"all_data": [dict(row._mapping) for row in rows]}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500
