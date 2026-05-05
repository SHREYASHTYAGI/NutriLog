  import React, { use, useEffect, useState } from "react";
  import Calendar from "react-calendar";
  import Select from "react-select";
  import Fdata from "./Fdata.json";
  import { supabase } from "./Supabase";
  import "./Calendar.css";
  import Pchart from "./Pchart";
  import DashboardLayout from "./components/DashboardLayout";
  import ChartCard from "./components/ChartCard";
  import StatsCard from "./components/StatsCard";
  import Card from "./components/Card";
  import "./styles/dashboard.css";

  function MainApp() {

    /* -------------------- DATE FORMATTER (GLOBAL) -------------------- */
    const formatDate = (date) => {
      return date.toLocaleDateString("en-CA"); // YYYY-MM-DD (no timezone issue)
    };

    /* -------------------- STATES -------------------- */
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [uniqueD, setUniqueD] = useState([]);
    const [bucket, setBucket] = useState(() => {
    const saved = localStorage.getItem("proData");
      return saved ? JSON.parse(saved) : [];
    });
    const [getId, setId] = useState("");
    const [qnt, setQnt] = useState("");
    const [targetP, setTargetp] = useState(0);
    const [manualP,setManualP]=useState("");


  /* -------------Store weight in Localstorage ---------------- */

    const [weight,setWeight]=useState(()=>{
      const saved=localStorage.getItem('weights');
      return saved?Number(saved):"";
    });
    
  useEffect(()=>{
    if (weight!==""){
    localStorage.setItem('weights',weight);
    setTargetp((weight * 1.6));
    }
  },[weight]);

    
  /* -------------------- FETCH ALL DATES FOR HIGHLIGHT -------------------- */
    const fetchAllD = async () => {
      const { data, error } = await supabase
        .from("DF_Intake")
        .select("date");

      if (!error && data) {
        const uniqueDates = [...new Set(data.map(item => item.date))];
        setUniqueD(uniqueDates);
      }
    };

    useEffect(() => {
      fetchAllD();
    }, []);

    /* -------------------- FETCH DATA FOR SELECTED DATE -------------------- */
    useEffect(() => {
      const fetchData = async () => {

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const formattedDate = formatDate(selectedDate);

        const { data } = await supabase
          .from("DF_Intake")
          .select("*")
          .eq("date", formattedDate)
          .eq("user_id", user.id);

        const sanitizedData = (data || []).map((item) => {
          const original = Fdata.find(f => f.name === item.item);
          return {
            uniqId: Date.now() + Math.random(),
            ...original,
            quantity: Number(item.quantity),
          };
        });

        setBucket(sanitizedData);
      };

      fetchData();
    }, [selectedDate]);

    /* -------------------- SAVE TO SUPABASE -------------------- */
    const savedtoS = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Login required");
        return;
      }

      if (bucket.length === 0) {
        alert("Bucket is empty");
        return;
      }

      const formattedDate = formatDate(selectedDate);

      const payload = bucket.map((item) => ({
        user_id: user.id,
        date: formattedDate,
        item: item.name,
        quantity: Number(item.quantity),
      }));

      const { error } = await supabase
        .from("DF_Intake")
        .insert(payload);

      if (error) {
        console.error(error);
        alert("Save failed ❌");
      } else {
        alert("Saved successfully ✅");
        setBucket([]);
        localStorage.removeItem("proData");
        await fetchAllD(); // refresh highlights
      }
    };

    /* -------------------- LOCAL STORAGE SYNC -------------------- */
    useEffect(() => {
      localStorage.setItem("proData", JSON.stringify(bucket));
    }, [bucket]);

    

    /* -------------------- FOOD OPTIONS -------------------- */
    const options = Fdata.map((e) => ({
      value: e.id,
      label: e.name,
    }));

    const selectedF = Fdata.find((e) => e.id === getId);

    const addItem = () => {

     if (manualP){
      setBucket([
        ...bucket,
        {
          uniqId:Date.now(),
          name:"Manual",
          protein:1,
          fats:0,
          calories:0,
          quantity:Number(manualP)
        }
      ])
      setManualP("")
      return
     }

      if (!qnt) {
        alert("Fill quantity");   
        return;
      }

     

      if (!selectedF) {
        alert("Fill all fields");
        return;
      }

      setBucket([
        ...bucket,
        {
          uniqId: Date.now(),
          ...selectedF,
          quantity: Number(qnt),
        },
      ]);

      setQnt("");
    };

    /* -------------------- TOTALS -------------------- */
    const totalP = bucket
      .reduce((sum, item) => sum + item.protein * item.quantity, 0)
      .toFixed(2);

    const totalC = bucket
      .reduce((sum, item) => sum + item.calories * item.quantity, 0)
      .toFixed(2);

      const totalF=bucket.reduce((sum,item)=>sum+item.fats*item.quantity,0).toFixed(2);

    /* -------------------- DELETE ITEM -------------------- */
    const handleD = (uniqId) => {
      const updatedB = bucket.filter((e) => e.uniqId !== uniqId);
      setBucket(updatedB);
    };

    /* -------------------- LOGOUT -------------------- */
  
    

    /* -------------------- UI -------------------- */
    return (
      <DashboardLayout>
        <div style={{display:'contents'}}>
          <div className="col-span-4">
          
            <ChartCard title="Calendar">
              <div style={{paddingTop:6}}>
                <Calendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  tileClassName={({ date, view }) => {
                    if (view === "month") {
                      const formattedDate = formatDate(date);
                      if (uniqueD.includes(formattedDate)) {
                        return "highlight-date";
                      }
                    }
                  }}
                />
              </div>
            </ChartCard>
          </div>

          <div className="col-span-8" style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
          }}>
    <ChartCard title="Progress"  >
      <Pchart
        bucket={bucket}
        totalP={Number(totalP)}
        totalC={Number(totalC)}
        totalF={Number(totalF)}
        targetP={Number(targetP)}
        
      />
    </ChartCard>
  </div>

          <div className="col-span-4">
            <StatsCard title="Target Protein" value={`${targetP.toFixed(0)} g`} hint="based on weight" />
          </div>

          <div className="col-span-4">
            <Card>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <label style={{color:'rgba(255,255,255,0.6)'}}>Enter your weight</label>
                <input
                  className="ft-input"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
                <div style={{marginTop:6}}>Target Protein Intake: {targetP.toFixed(2)}g</div>
              </div>
            </Card>
          </div>

          <div className="col-span-4">
            <Card>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <label style={{color:'rgba(255,255,255,0.6)'}}>Add Food</label>

                <Select
    options={options}
    onChange={(e) => setId(e.value)}
    styles={{
      control: (base) => ({
        ...base,
        backgroundColor: "rgba(18,18,18,0.92)",
        borderColor: "rgba(85,230,255,0.08)",
        color: "#fff",
        boxShadow: "0 0 20px rgba(0,120,255,0.04)",
        borderRadius: "14px",
      }),
      singleValue: (base) => ({
        ...base,
        color: "#ffffff",
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: "rgba(18,18,18,0.98)",
        borderRadius: "14px",
        overflow: "hidden",
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
          ? "rgba(85,230,255,0.08)"
          : "transparent",
        color: "#fff",
        cursor: "pointer",
      }),
      input: (base) => ({
        ...base,
        color: "#fff",
      }),
      placeholder: (base) => ({
        ...base,
        color: "rgba(255,255,255,0.45)",
      }),
    }}
  />
                <input className="ft-input" type="number" placeholder="Quantity" value={qnt} onChange={(e)=>setQnt(e.target.value)} />
                <div className="manual-entry">
                  <span className="manual-text">Not in list?</span>
                  <input
                    className="ft-input manual-input"
                    type="number"
                    placeholder="Add protein manually in grams"
                    value={manualP}
                    onChange={(e) => setManualP(e.target.value)}
                  />
                  <button className="btn primary" onClick={addItem}>Add</button>
                  <button className="btn ghost" onClick={savedtoS}>Save</button>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-12">
            <Card>
              <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
                {bucket.map((item) => (
                  <div key={item.uniqId} style={{flex:'1 1 220px', background:'rgba(255,255,255,0.02)', padding:10, borderRadius:12}}>
                    <div style={{fontWeight:700}}>{item.name}</div>
                    <div style={{color:'rgba(255,255,255,0.6)'}}>{(item.protein * item.quantity).toFixed(2)} g</div>
                    <div style={{marginTop:8}}><button className="btn ghost" onClick={() => handleD(item.uniqId)}>Delete</button></div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:12}}>
                <strong>Total Protein:</strong> {totalP}g • <strong>Calories:</strong> {totalC}
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  export default MainApp;
