/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { MidpointEulerMutDV, RK4MutDV };
import * as M3 from "./matrices3D.mjs";
import * as M4 from "./matrices4D.mjs";

const MidpointEulerMutDV = function(getAccel, d, v, dt) {
	const accel = getAccel(d);
	const vFinal = accel.ScaleMut(dt).AddMut(v);
	
	//I don't understand why, but Divide is measurably faster here than DivideMut
	//maybe it's because getAccel caches Divide, and as an Array.proto method,
	//JS has to look it up. Even still, it's called thousands of times, so why???
	const deltaD = v.AddMut(vFinal).Divide(2.0).ScaleMut(dt);
	const dFinal = d.AddMut(deltaD);

	return [dFinal, vFinal];
};

const RK4MutDV = function(getAccel, d, v, dt) {
	const k1 = getAccel(d);//accel at start
	
	const v2 = k1.Scale(dt / 2.0).AddMut(v);
	const d2 = v2.ScaleMut(dt / 2.0).AddMut(d);
	const k2 = getAccel(d2);//accel in middle
	
	const v3 = k2.Scale(dt / 2.0).AddMut(v);
	const d3 = v3.ScaleMut(dt / 2.0).AddMut(d);
	const k3 = getAccel(d3);//accel in middle if accel at start was k2
	
	const v4 = k3.Scale(dt).AddMut(v);
	const d4 = v4.ScaleMut(dt).AddMut(d);
	const k4 = getAccel(d4);//accel at end if accel at start was k3
	
	const accel = (k1.AddMut(k2.ScaleMut(2.0)).AddMut(k3.ScaleMut(2.0)).AddMut(k4)).DivideMut(6.0);
	
	const vFinal = accel.Scale(dt).AddMut(v);
	const dFinal = v.ScaleMut(dt).AddMut(d).AddMut(accel.ScaleMut(dt * dt * 0.5));
	
	return [dFinal, vFinal];
};

