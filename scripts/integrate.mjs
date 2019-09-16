/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { MidpointEulerMutV, RK4MutV };
import * as M3 from "./matrices3D.mjs";
import * as M4 from "./matrices4D.mjs";

const MidpointEulerMutV = function(getAccel, d, v, dt) {
	const accel = getAccel(d);
	const vFinal = accel.ScaleMut(dt).AddMut(v);
	
	const dFinal = v.AddMut(vFinal).ScaleMut(dt / 2.0).AddMut(d);
	return [dFinal, vFinal];
};

const RK4MutV = function(getAccel, d, v, dt) {
	const k1 = getAccel(d);//accel at start
	
	//k1.slice() induces a performance hit
	const mut = [0, 0, 0];
	mut[0] = k1[0]; mut[1] = k1[1]; mut[2] = k1[2];
	const v2 = mut.ScaleMut(dt / 2.0).AddMut(v);
	const d2 = v2.ScaleMut(dt / 2.0).AddMut(d);
	const k2 = getAccel(d2);//accel in middle
	
	mut[0] = k2[0]; mut[1] = k2[1]; mut[2] = k2[2];
	const v3 = mut.ScaleMut(dt / 2.0).AddMut(v);
	const d3 = v3.ScaleMut(dt / 2.0).AddMut(d);
	const k3 = getAccel(d3);//accel in middle if accel at start was k2
	
	mut[0] = k3[0]; mut[1] = k3[1]; mut[2] = k3[2];
	const v4 = mut.ScaleMut(dt).AddMut(v);
	const d4 = v4.ScaleMut(dt).AddMut(d);
	const k4 = getAccel(d4);//accel at end if accel at start was k3
	
	k2.ScaleMut(2.0);
	k3.ScaleMut(2.0);
	const accel = k1.AddMut(k2).AddMut(k3).AddMut(k4).DivideMut(6.0);
	
	mut[0] = accel[0]; mut[1] = accel[1]; mut[2] = accel[2]; 
	const vFinal = mut.ScaleMut(dt).AddMut(v);
	const dFinal = v.ScaleMut(dt).AddMut(d).AddMut(accel.ScaleMut(dt * dt * 0.5));
	
	return [dFinal, vFinal];
};

