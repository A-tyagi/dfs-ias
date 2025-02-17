import React, {useState, useContext} from 'react';
import {ChevronLeft, ChevronRight} from 'react-bootstrap-icons';
import {color} from '../../design-system/style';
import {Select, Input} from '../../design-system/form';
import {InputGroup, FormControl, Modal, Button, Table, Badge} from 'react-bootstrap';
import {formatMilitaryTime} from "../../util/formatData";
import Lottie from "lottie-react";
import carAnimation from '../../assets/sedan-car-animation.json';
import aslAnimation from '../../assets/asl-animation.json';
import {timeSlots, gender, ethnicity, shirtSize, schoolYear} from '../../constant';
import {PROGRAMS} from "../../data/PROGRAMS";
import {GlobalContext} from "../../context/GlobalContextProvider";

export default function AddInstructorManuallyModal({handleSubmit}) {
    const [step, setStep] = useState(0);
    const [programPreference, setProgramPreference] = useState([]);
    const [timeAvailability, setTimeAvailability] = useState([]);
    const { programData } = useContext(GlobalContext);

    const [formInput, setFormInput] = useState(
        {
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: null,
            gender: null,
            ethnicity: null,
            university: null,
            major: null,
            schoolYear: null,
            graduationDate: null,
            firstPref: null,
            secondPref: null,
            thirdPref: null,
            fourthPref: null,
            hasCar: false,
            otherLanguages: null,
            isASL: false,
            shirtSize: null,
            availability: null,
            programmingLanguages: null,
        }
    );

    const handleFormInput = (input = null, field) => {
        switch (field) {
            case "First Name":
                setFormInput({...formInput, firstName: input})
                break;
            case "Last Name":
                setFormInput({...formInput, lastName: input})
                break;
            case "E-mail Address":
                setFormInput({...formInput, email: input})
                break;
            case "Phone Number":
                setFormInput({...formInput, phoneNumber: input})
                break;
            case "Gender":
                setFormInput({...formInput, gender: input})
                break;
            case "Ethnicity":
                setFormInput({...formInput, ethnicity: input})
                break;
            case "Shirt size":
                setFormInput({...formInput, shirtSize: input})
                break;
            case "Skilled in (ASL)":
                setFormInput({...formInput, isASL: !formInput.isASL})
                break;
            case "Owns a car":
                setFormInput({...formInput, hasCar: !formInput.hasCar})
                break;
            case "University":
                setFormInput({...formInput, university: input});
                break;
            case "Major":
                setFormInput({...formInput, major: input});
                break;
            case "Languages other than English":
                setFormInput({...formInput, otherLanguages: input});
                break;
            case "School Year":
                setFormInput({...formInput, schoolYear: input});
                break;
            case "Graduation Date":
                setFormInput({...formInput, graduationDate: input});
                break;
            case "Programming Languages":
                setFormInput({...formInput, programmingLanguages: input});
                break;
        }
    };

    const activeStep = {
        fontWeight: 'bold',
        color: color.solid.BLUE,
    };

    const inactiveStep = {
        fontWeight: '400',
        color: color.neutral.MIDGRAY,
    };

    const handleNextStep = () => setStep(step + 1);

    const handlePrevStep = () => setStep(step - 1);

    const handleTimeSlotInput = (e) => {
        if (timeAvailability.some(slot => JSON.stringify(slot) === JSON.stringify(e))) {
            setTimeAvailability(timeAvailability.filter(function (ele) {
                return JSON.stringify(ele) != JSON.stringify(e);
            }));
        } else {
            setTimeAvailability([...timeAvailability, e]);
        };
    };

    React.useEffect(() => {
        parseAvailability(timeAvailability);
    }, [timeAvailability])

    const parseAvailability = (arr) => {
        let parsed = [];
        arr.sort((a, b) => {
            if (a.weekday > b.weekday) return 1;
            if (a.weekday < b.weekday) return -1;

            if (Number(a.startTime.split(':')[0]) < Number(b.startTime.split(':')[0])) return -1;
            if (Number(a.startTime.split(':')[0]) > Number(b.startTime.split(':')[0])) return 1;
        });

        arr.forEach((e) => {
            if (parsed.length === 0) {
                parsed.push(JSON.parse(JSON.stringify(e)));
            } else {
                if (parsed[parsed.length - 1].weekday === e.weekday) {
                    if (parsed[parsed.length - 1].endTime === e.startTime) {
                        parsed[parsed.length - 1].endTime = e.endTime;
                    } else {
                        parsed.push(JSON.parse(JSON.stringify(e)));
                    }
                } else {
                    parsed.push(JSON.parse(JSON.stringify(e)));
                }
            }
        })

        setFormInput({...formInput, availability: parsed})
    };

    const renderTimeSlotCheckboxes = (time) => {
        const element = [];

        for (let i = 0; i < 5; i++) {
            element.push(
                <td key={i} style={{textAlign: 'center'}}>
                    <input
                        onChange={() => handleTimeSlotInput({
                            weekday: i + 1,
                            startTime: timeSlots[time].startTime,
                            endTime: timeSlots[time].endTime
                        })}
                        type={'checkbox'}
                        aria-label="Checkbox for following text input"
                        checked={timeAvailability.some(slot => JSON.stringify(slot) === JSON.stringify({
                            weekday: i + 1,
                            startTime: timeSlots[time].startTime,
                            endTime: timeSlots[time].endTime
                        }))}
                    />
                </td>
            )
        }

        return element;
    }

    const basicInfo = (
        <div style={{padding: '2rem 4rem', display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '50%', marginRight: '1.5rem'}}>
                <div style={{display: 'flex'}}>
                    <div style={{width: '50%', marginRight: '1.5rem'}}>
                        <Input label={'First Name'} handler={handleFormInput} state={formInput.firstName} modal/>
                    </div>
                    <div style={{width: '50%'}}>
                        <Input label={'Last Name'} handler={handleFormInput} state={formInput.lastName} modal/>
                    </div>
                </div>
                <Input label={'E-mail Address'} handler={handleFormInput} state={formInput.email} modal/>
                <Input label={'Phone Number'} handler={handleFormInput} state={formInput.phoneNumber} modal/>
            </div>
            <div style={{width: '25%', marginRight: '1.5rem'}}>
                <Select options={gender} label={'Gender'} handler={handleFormInput} state={formInput.gender} modal/>
                <Select options={ethnicity} label={'Ethnicity'} handler={handleFormInput} state={formInput.ethnicity}
                        modal/>
                <Select options={shirtSize} label={'Shirt size'} handler={handleFormInput} state={formInput.shirtSize}
                        modal/>
            </div>
            <div style={{width: '25%'}}>
                <div onClick={() => handleFormInput(null, "Owns a car")} style={{
                    marginBottom: '1.5rem',
                    borderRadius: '6px',
                    backgroundColor: formInput.hasCar ? '#E9FFEA' : color.neutral.LIGHTGRAY,
                    width: '100%',
                    height: '110px',
                    textAlign: 'center'
                }}>
                    <div style={{height: '70%', display: 'flex'}}>
                        <Lottie animationData={carAnimation}/>
                    </div>
                    <h6>Owns a car</h6>
                </div>
                <div onClick={() => handleFormInput(null, "Skilled in (ASL)")} style={{
                    borderRadius: '6px',
                    backgroundColor: formInput.isASL ? '#E9FFEA' : color.neutral.LIGHTGRAY,
                    width: '100%',
                    height: '110px',
                    textAlign: 'center'
                }}>
                    <div style={{height: '70%', display: 'flex'}}>
                        <Lottie animationData={aslAnimation}/>
                    </div>
                    <h6>Skilled in (ASL)</h6>
                </div>
            </div>
        </div>
    );

    const educationBackground = (
        <div style={{padding: '2rem 4rem', display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '50%', marginRight: '1.5rem'}}>
                <Input label={'University'} handler={handleFormInput} state={formInput.university} modal/>
                <Input label={'Major'} handler={handleFormInput} state={formInput.major} modal/>
                <Input label={'Languages other than English'} handler={handleFormInput} state={formInput.otherLanguages}
                       modal/>
            </div>
            <div style={{width: '50%'}}>
                <Select options={schoolYear} label={'School Year'} handler={handleFormInput}
                        state={formInput.schoolYear} modal/>
                <Input label={'Graduation Date'} handler={handleFormInput} state={formInput.graduationDate} modal/>
                <Input label={'Programming Languages'} handler={handleFormInput} state={formInput.programmingLanguages}
                       modal/>
            </div>
        </div>
    );

    const availability = (
        <div style={{padding: '2rem', display: 'flex', flexDirection: 'row'}}>
            <Table borderless style={{borderSpacing: '0 0.4rem', borderCollapse: 'separate'}}>
                <thead>
                <tr>
                    <th></th>
                    <th>Mondays</th>
                    <th>Tuedays</th>
                    <th>Wednesdays</th>
                    <th>Thursdays</th>
                    <th>Fridays</th>
                </tr>
                </thead>
                <tbody>
                {timeSlots.map((e, idx) => (
                    <tr key={idx} style={{borderRadius: '10px', background: color.neutral.LIGHTGRAY}}>
                        <td>
                            {formatMilitaryTime(e.startTime)} - {formatMilitaryTime(e.endTime)}
                        </td>
                        {renderTimeSlotCheckboxes(idx)}
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );

    const handleProgramPreferences = (e) => {
        if (programPreference.includes(e)) {
            setProgramPreference(programPreference.filter(function (ele) {
                return ele != e;
            }));
        } else if (programPreference.length < 4) {
            setProgramPreference([...programPreference, e]);
        }
        ;
    };

    React.useEffect(() => {
        setFormInput({
                ...formInput,
                firstPref: programPreference[0] || null,
                secondPref: programPreference[1] || null,
                thirdPref: programPreference[2] || null,
                fourthPref: programPreference[3] || null
            }
        )
    }, [programPreference])


    const preferences = (
        <div style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignContent: 'space-around'
        }}>
            {Object.values(programData).map((e, idx) => (
                <div key={idx} onClick={() => handleProgramPreferences(e.name)} style={{
                    borderRadius: '6px',
                    backgroundColor: color.neutral.LIGHTGRAY,
                    height: '140px',
                    textAlign: 'center',
                    width: '140px',
                    margin: '0.75rem',
                    display: 'flex'
                }}>
                    <div style={{
                        margin: 'auto',
                        objectFit: 'contain',
                        opacity: programPreference.length == 4 && !programPreference.includes(e.name) && '0.2'
                    }}>
                        <img style={{height: 60, marginBottom: '1rem'}} src={new Buffer.from(e.logo.data).toString("ascii")}/>
                        <h6>{e.name}</h6>
                    </div>
                    {programPreference.includes(e.name) &&
                    <div style={{position: 'absolute'}}>
                        <Badge pill variant="warning">
                            {programPreference.indexOf(e.name) + 1}
                        </Badge>
                    </div>
                    }
                </div>
            ))}
        </div>
    );

    return (
        <>
            <Modal.Body>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{padding: '0 3rem', textAlign: 'center'}}>
                        <span style={step === 0 ? activeStep : inactiveStep}>Basic Information</span>
                        <ChevronRight style={{color: color.neutral.MIDGRAY, margin: '0 0.5rem'}}/>
                        <span style={step === 1 ? activeStep : inactiveStep}>Educational Background</span>
                        <ChevronRight style={{color: color.neutral.MIDGRAY, margin: '0 0.5rem'}}/>
                        <span style={step === 2 ? activeStep : inactiveStep}>Availability</span>
                        <ChevronRight style={{color: color.neutral.MIDGRAY, margin: '0 0.5rem'}}/>
                        <span style={step === 3 ? activeStep : inactiveStep}>Preferences</span>
                    </div>
                    {step === 0 && basicInfo}
                    {step === 1 && educationBackground}
                    {step === 2 && availability}
                    {step === 3 && preferences}
                </div>
            </Modal.Body>
            <Modal.Footer style={{border: '0', padding: '0 3rem 2rem 3rem'}}>
                <Button variant="outline-primary" onClick={handlePrevStep} style={{marginRight: 'auto'}}><ChevronLeft/>Back</Button>
                {step != 3 ? (<Button variant="primary" onClick={handleNextStep}>Next<ChevronRight/></Button>) : (
                    <Button variant="primary" onClick={() => handleSubmit(formInput)}>Submit</Button>)}
            </Modal.Footer>
        </>
    );
}