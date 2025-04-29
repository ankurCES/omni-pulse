import React, { useState, useEffect } from "react";
import classNames from "classnames";

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CForm,
  CFormInput,
  CInputGroup,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormSelect,
  CCollapse,
  CFormTextarea,
  CFormSwitch,
  CFormLabel,
  CDropdownDivider,
  CFormCheck,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from "@coreui/icons";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import ThreeWord from "../threewidgets/threeword";
// import ThreeParticle from "../threewidgets/threeParticle";
import R3Graph from "../threewidgets/r3Graph";
import MainChart from "./MainChart";

const Dashboard = () => {
  const progressExample = [
    {
      title: "Location",
      value: "29.703 Users",
      percent: 100,
      color: "#FFB30F",
    },
    { title: "Subject", value: "24.093 Users", percent: 100, color: "#D8F793" },
    { title: "Person", value: "78.706 Views", percent: 100, color: "#ED6A5A" },
    {
      title: "Organization",
      value: "22.123 Users",
      percent: 100,
      color: "#A8F9FF",
    },
    {
      title: "Article",
      value: "22.123 Users",
      percent: 100,
      color: "#3066BE",
    },
  ];

  // const keywordList = {
  //   Canada: {
  //     count: 2,
  //     type: "Location",
  //   },
  //   China: {
  //     count: 5,
  //     type: "Location",
  //   },
  //   "Customs (Tariff)": {
  //     count: 7,
  //     type: "Subject",
  //   },
  //   "Economic Conditions and Trends": {
  //     count: 1,
  //     type: "Subject",
  //   },
  //   Europe: {
  //     count: 1,
  //     type: "Location",
  //   },
  //   "European Union": {
  //     count: 1,
  //     type: "Organization",
  //   },
  //   "Factories and Manufacturing": {
  //     count: 4,
  //     type: "Subject",
  //   },
  //   "Foreign Investments": {
  //     count: 1,
  //     type: "Subject",
  //   },
  //   "Gross Domestic Product": {
  //     count: 1,
  //     type: "Subject",
  //   },
  //   "Group of Twenty": {
  //     count: 1,
  //     type: "Organization",
  //   },
  //   "International Monetary Fund": {
  //     count: 1,
  //     type: "Organization",
  //   },
  //   "International Relations": {
  //     count: 1,
  //     type: "Subject",
  //   },
  //   "International Trade and World Market": {
  //     count: 10,
  //     type: "Subject",
  //   },
  //   "Lighthizer, Robert E": {
  //     count: 1,
  //     type: "Person",
  //   },
  //   Mexico: {
  //     count: 2,
  //     type: "Location",
  //   },
  //   "Mohammed bin Salman (1985- )": {
  //     count: 1,
  //     type: "Person",
  //   },
  //   "Politics and Government": {
  //     count: 1,
  //     type: "Subject",
  //   },
  //   "Presidential Election of 2024": {
  //     count: 1,
  //     type: "Subject",
  //   },
  //   "Prices (Fares, Fees and Rates)": {
  //     count: 2,
  //     type: "Subject",
  //   },
  //   "Protectionism (Trade)": {
  //     count: 3,
  //     type: "Subject",
  //   },
  //   "Reeves, Rachel (1979- )": {
  //     count: 1,
  //     type: "Person",
  //   },
  //   "Saudi Arabia": {
  //     count: 1,
  //     type: "Location",
  //   },
  //   "Trump, Donald J": {
  //     count: 7,
  //     type: "Person",
  //   },
  //   "US Dollar (Currency)": {
  //     count: 2,
  //     type: "Subject",
  //   },
  //   "United States": {
  //     count: 2,
  //     type: "Location",
  //   },
  //   "United States Economy": {
  //     count: 8,
  //     type: "Subject",
  //   },
  //   "United States International Relations": {
  //     count: 5,
  //     type: "Subject",
  //   },
  //   "United States Politics and Government": {
  //     count: 5,
  //     type: "Subject",
  //   },
  // };

  const [keywordList, setKeywordList] = useState([]);
  const [articles, setArticles] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchNewsArticles = async () => {
    const query = document.getElementById("searchQueryInput").value;
    const filter = document.getElementById("relationQuery").value;
    const relationTag = document.getElementById("relationTag").value;
    if (query) {
      setLoading(true);

      let newsUrl = !filter
        ? `http://127.0.0.1:5000/nyt-graph?q=${query}`
        : `http://127.0.0.1:5000/nyt-graph?q=${query}&fq=${relationTag}:${filter}`;

      // Fetch & Render Results
      const response = await fetch(newsUrl);
      const data = await response.json();
      // console.log(data);
      setArticles(data.graph);
      setKeywordList(data.keywords);
      setAnalysis(data.analysis);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchNewsArticles = async () => {
      const response = await fetch(
        "http://127.0.0.1:5000/nyt-graph?q=US trade tarrif"
      );
      const data = await response.json();
      console.log(data);
      setArticles(data.graph);
      setKeywordList(data.keywords);
      setLoading(false);
    };

    fetchNewsArticles();
  }, []);

  return (
    <>
      {/* <WidgetsDropdown className="mb-4" /> */}
      <CCard className="mb-4">
        <CCardHeader>OmniPulse - News Explorer</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CForm>
                <CRow xs={{ gutterX: 1 }}>
                  <CCol>
                    <div className="mb-3">
                      <CFormInput
                        id="searchQueryInput"
                        type="text"
                        placeholder="Search Query"
                        aria-label="lg input example"
                      />
                    </div>
                  </CCol>
                </CRow>
                <CRow xs={{ gutterX: 2 }}>
                  <CCol>
                    <div className="mb-3">
                      <CFormInput
                        id="relationQuery"
                        type="text"
                        placeholder="Filter Query"
                        aria-label="lg input example"
                      />
                    </div>
                  </CCol>
                  <CCol>
                    <div className="mb-3">
                      <CInputGroup>
                        <CFormSelect id="relationTag" aria-label="RelationTag">
                          <option value="timesTag.location">
                            As a Location
                          </option>
                          <option value="timesTag.subject">As a Subject</option>
                          <option value="timesTag.organization">
                            As an Organization
                          </option>
                        </CFormSelect>
                        <CButton
                          type="button"
                          color="secondary"
                          variant="outline"
                        >
                          Add
                        </CButton>
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>
                <CRow xs={{ gutterX: 1 }}>
                  <CCol>
                    <div className="d-grid gap-2">
                      <CButton
                        color="primary"
                        variant="ghost"
                        onClick={searchNewsArticles}
                      >
                        Search & Analyze
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
                <CCollapse visible={!loading && analysis.length > 0}>
                  <CCard className="mt-3">
                    <CCardBody>{analysis}</CCardBody>
                  </CCard>
                </CCollapse>
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Article Network
              </h4>
              <br></br>
            </CCol>
          </CRow>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  "d-none d-xl-block": index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">
                  <span style={{ color: item.color }}>{item.title}</span>
                </div>
              </CCol>
            ))}
          </CRow>
          <CRow>
            <CCol md={12}>
              {!loading ? (
                <div className="three-d">
                  <R3Graph blocks={articles} />
                </div>
              ) : null}
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter></CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Word Spectrum
              </h4>
              <div className="small text-body-secondary">Top Occurrences</div>
              <br></br>
            </CCol>
            <CCol sm={7} className="d-none d-md-block"></CCol>
          </CRow>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  "d-none d-xl-block": index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">
                  <span style={{ color: item.color }}>{item.title}</span>
                </div>
              </CCol>
            ))}
          </CRow>
          <CRow>
            <CCol md={12}>
              {!loading ? (
                <div className="three-d">
                  <ThreeWord count={8} radius={20} keywords={keywordList} />
                </div>
              ) : null}
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter></CCardFooter>
      </CCard>
    </>
  );
};

export default Dashboard;
