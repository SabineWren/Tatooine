/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { MidpointEuler, RK4 };
import * as M3 from "./matrices3D.mjs";
import * as M4 from "./matrices4D.mjs";

const MidpointEuler = function(getAccel, d, v, dt) {
	const accel = getAccel(d);
	const vFinal = accel.ScaleMut(dt).Add(v);
	
	const deltaD = v.Add(vFinal).Divide(2.0).ScaleMut(dt);
	const dFinal = d.Add(deltaD);

	return [dFinal, vFinal];
};

const RK4 = function(getAccel, d, v, dt) {
	const k1 = getAccel(d);//accel at start
	
	const v2 = v.Add( k1.Scale(dt / 2.0) );
	const d2 = d.Add( v2.ScaleMut(dt / 2.0) );
	const k2 = getAccel(d2);//accel in middle
	
	const v3 = v.Add( k2.Scale(dt / 2.0) );
	const d3 = d.Add( v3.ScaleMut(dt / 2.0) );
	const k3 = getAccel(d3);//accel in middle if accel at start was k2
	
	const v4 = v.Add( k3.Scale(dt) );
	const d4 = d.Add( v4.ScaleMut(dt) );
	const k4 = getAccel(d4);//accel at end if accel at start was k3
	
	const acceleration = (k1.Add(k2.ScaleMut(2.0)).Add(k3.ScaleMut(2.0)).Add(k4)).Divide(6.0);
	
	const vFinal = v.Add(acceleration.Scale(dt));
	const dFinal = d.Add(v.ScaleMut(dt)).Add(acceleration.ScaleMut(dt * dt * 0.5));
	
	return [dFinal, vFinal];
};

