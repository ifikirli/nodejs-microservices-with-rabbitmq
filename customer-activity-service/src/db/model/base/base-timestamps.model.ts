import BaseModel from "./base.model";

export default interface BaseTimestampsModel extends BaseModel {
    
    created_at?: Date;
    updated_at?: Date;
}