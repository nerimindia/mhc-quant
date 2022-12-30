import "./InputElement.css";
import { useState, useEffect } from 'react';

const InputElement = (props) => {
		
		const [ddValue, setDdValue] = useState("");
		const [dropDownOpen, setDropDownOpen] = useState(false);
		useEffect(() => {
			setInitialDdValue();
		}, [props]);

		const setInitialDdValue = () => {
			props?.list?.map(x => {
				if(x.key == props.value)
				{
					setDdValue(x.title);
					console.log(x.title);
				}
			});
		}
		if(props.type == 'text' || props.type == 'password') {
			return (
				<div className={`text-box ${props.className}`}>
					<span className={`field-label ${props.value && props.value.toString().length && 'filled'}`}>{props.label}</span>
					<input type={`${ props?.type || 'text'}`} value={props.value} onChange={(e) => props.onValueChange(e, props.fieldName)} />
					
				</div>
			)	
		}
		if(props.type == 'searchBox') {
			return (
				<div className={`search-box ${props.className}`}>
					<span className={`field-label ${props.value?.length && 'filled'}`}>{props.label}</span>
					<input type='text' value={props.value} onChange={(e) => props.onValueChange(e, props.fieldName)} />
					<button onClick={props.onSearch}><span className="iconify" data-icon="bx:search-alt"></span></button>
				</div>
			)	
		}
		
		const hideDropDownItemsList = (e) => {
			if(!(e.target.className == "drop-down-selected-item drop-down-item" || e.target.className == "drop-down-item")) {
				setDropDownOpen(false);	
			}
			
		}
		document.body.addEventListener('click', hideDropDownItemsList, true); 
		if(props.type == 'file') {
			return (
				<label className={`upload-box ${props.className || ''}`}>

					<span className={`field-label ${props.value?.length && 'filled'}`}>
						{ 
							!props.isSet &&
								<div className="icon-holder gray">
									<span className="iconify" data-icon="icon-park:upload-logs"></span>
								</div>
						}
						{
							props.isSet && <div className="icon-holder green"><span className="iconify" data-icon="bi:file-earmark-check-fill"></span></div>
						}
					{props.label}</span>

					<input type={`${ props?.type || 'text'}`} onChange={(e) => props.onValueChange(e, props.fieldName)} />
					

				</label>
			)	
		}

		if(props.type == 'date') {
			return (
				<input className="date-box" type={`${ props?.type || 'text'}`} onChange={(e) => props.onValueChange(e, props.fieldName)} />
				
			)	
		}

		if(props.type == 'captcha') {
			return (
				<div className="captcha-box" onChange={(e) => props.onValueChange(e, props.fieldName)}>CAPTCHA BOX</div>
				
			)	
		}
				
		if(props.type == 'dropdown') {
			return (
				<div className={`drop-down ${props.className}`}>
					
					{
						dropDownOpen &&
						<div className="drop-down-other-items">
							{
								props.list.map(x => {
									return (
										<div className="drop-down-item" onClick={(e)=>props.onValueChange({...e, currentTarget: {value: x.key}}, props.fieldName)}>
										{x.title}{x.subTitle && `| ${x.subTitle}`}
									</div>
									)	
								})
								
							}
						</div>
					}
					<div className="drop-down-selected-item drop-down-item" onClick={() => setDropDownOpen(!dropDownOpen)}>
						<span className={`field-label ${(dropDownOpen || ddValue) && 'filled'}`}>{props.label}</span>
						{ddValue}
						<div className="drop-down-triangle"><span className="iconify" data-icon="bxs:down-arrow"></span></div>
					</div>	
					
				</div>
			)	
		}
}
export default InputElement;