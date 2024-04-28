import { Parcel } from './shared/Parcel';
import { ResponseHTTP } from './shared/ResponseHTTP';

// const parcel: IParcel = new Parcel();
const parcel: Parcel = new Parcel();
parcel.setError(false).setDesc('GG').setPayload('3333');
const response: ResponseHTTP = new ResponseHTTP();
// response.setStatus(777).setBody(parcel.pack());

console.log(response.seal());
