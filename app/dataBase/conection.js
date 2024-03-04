import mongoose from "mongoose";

const connectToDB =async  () => {

    await mongoose.connect(process.env.CONNECTION_URL).then(()=>{
        console.log('connect success to data base..........');
    }).catch((err)=>{
        console.log('failed',err);
    })
}
export default connectToDB