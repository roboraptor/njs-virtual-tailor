'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert, Spinner, Nav } from 'react-bootstrap';
import { Ruler, CheckCircle2, AlertTriangle, Download, RefreshCw, HelpCircle, FileText, ShoppingBag, User } from 'lucide-react';

/**
 * Komponenta vizuální stupnice s interpretací pro uživatele
 */
const FitScale = ({ label, userValue, min, max, sizeName }) => {
  if (userValue === undefined || userValue === null || userValue === '' || isNaN(userValue)) return null;

  const numUserValue = parseFloat(userValue);
  const numMin = parseFloat(min);
  const numMax = parseFloat(max);

  if (isNaN(numMin) || isNaN(numMax)) return null;

  const range = numMax - numMin;
  const position = range !== 0 ? ((numUserValue - numMin) / range) * 100 : 50;
  
  let trackColor = 'bg-success';
  let statusText = 'Ideální střih';
  let statusDesc = 'Tento rozměr odpovídá standardu pro vaši postavu.';

  if (position < 20) {
    trackColor = 'bg-warning text-dark';
    statusText = 'Volnější';
    statusDesc = 'Oblečení bude v této části volnější, než je u tohoto střihu zvykem.';
  } else if (position > 80 && position <= 100) {
    trackColor = 'bg-warning text-dark';
    statusText = 'Velmi vypasované';
    statusDesc = 'Bude to sedět těsně na tělo. Pokud preferujete pohodlí, zvažte větší velikost.';
  } else if (position < 0 || position > 100) {
    trackColor = 'bg-danger text-white';
    statusText = position < 0 ? 'Příliš velké' : 'Příliš malé';
    statusDesc = 'Tento rozměr je mimo doporučený rozsah pro tuto velikost.';
  }

  return (
    <div className="mb-4 p-3 border-0 rounded-4 bg-white shadow-sm border-start border-4" style={{ borderColor: position < 0 || position > 100 ? '#dc3545' : '#198754' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-bold text-uppercase small text-muted ls-wide">{label}</span>
        <Badge bg={position < 0 || position > 100 ? 'danger' : 'light'} className="text-dark border">
          {statusText}
        </Badge>
      </div>
      
      <div className="position-relative mb-2" style={{ height: '24px' }}>
        <div className="progress w-100 rounded-pill" style={{ height: '8px', marginTop: '8px', backgroundColor: '#e9ecef' }}>
          <div className={`progress-bar rounded-pill ${trackColor}`} style={{ width: '100%', opacity: 0.3 }}></div>
        </div>
        
        <div 
          className="position-absolute translate-middle-x"
          style={{ 
            left: `${Math.min(Math.max(position, -2), 102)}%`, 
            top: '-4px',
            transition: 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 10
          }}
        >
          <div className="rounded-circle border border-2 border-white shadow-sm" style={{ width: '16px', height: '16px', backgroundColor: '#000' }}></div>
        </div>
      </div>
      <p className="small text-muted mb-0" style={{ fontSize: '0.8rem' }}>{statusDesc}</p>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState('measure'); // 'measure' | 'result'
  const [productType, setProductType] = useState('slim-shirt');
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [devMode, setDevMode] = useState(false);
  
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    neck: '',
    arm: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/sizes.csv');
        const text = await response.text();
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim();
            return obj;
          }, {});
        });
        setCsvData(data);
      } catch (err) {
        console.error("Chyba při načítání CSV:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (devMode) {
      setMeasurements({ chest: '99', waist: '88', neck: '40', arm: '64' });
    }
  }, [devMode]);

  const evaluation = useMemo(() => {
    if (!csvData.length || !measurements.chest) return null;
    const userChest = parseFloat(measurements.chest);
    
    // Filtrujeme podle typu produktu, pokud ho máme v CSV (v našem demo CSV je "classic-shirt")
    const filteredByProduct = csvData.filter(row => row.product_id === 'classic-shirt');
    
    const matched = filteredByProduct.find(row => 
      userChest >= parseFloat(row.chest_min) && userChest <= parseFloat(row.chest_max)
    );

    return matched || "M2M";
  }, [measurements, csvData]);

  return (
    <div className="bg-light min-vh-100 font-sans">
      <Container className="py-5" style={{ maxWidth: '900px' }}>
        {/* Header Section */}
        <div className="text-center mb-5">
          <Badge bg="dark" className="mb-2 px-3 py-2 text-uppercase ls-wide">Premium Tailoring Service</Badge>
          <h1 className="display-5 fw-bold mb-3">Váš digitální krejčí</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
            Zadejte své míry a my vám doporučíme ideální střih z naší kolekce, který vám padne jako druhá kůže.
          </p>
        </div>

        {/* Product Selector Tab */}
        <div className="d-flex justify-content-center mb-4">
          <Nav variant="pills" className="bg-white p-1 rounded-pill shadow-sm border" activeKey={productType}>
            <Nav.Item>
              <Nav.Link eventKey="slim-shirt" onClick={() => setProductType('slim-shirt')} className="rounded-pill px-4 py-2 border-0">Slim Fit Košile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="classic-shirt" onClick={() => setProductType('classic-shirt')} className="rounded-pill px-4 py-2 border-0">Classic Fit</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Row className="g-0">
                {/* Left Side: Inputs */}
                <Col md={12} className="p-4 p-md-5 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Zadejte své míry</h4>
                    <Form.Check 
                      type="switch"
                      label="Testovací data"
                      checked={devMode}
                      onChange={() => setDevMode(!devMode)}
                      className="small text-muted"
                    />
                  </div>

                  <Form>
                    <Row className="g-4 mb-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small text-uppercase fw-bold text-muted">Hrudník (cm)</Form.Label>
                          <div className="input-group input-group-lg border rounded-3 overflow-hidden">
                            <span className="input-group-text bg-white border-0 text-muted"><User size={18} /></span>
                            <Form.Control 
                              type="number" 
                              className="border-0 bg-white"
                              value={measurements.chest}
                              onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                              placeholder="00"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small text-uppercase fw-bold text-muted">Pas (cm)</Form.Label>
                          <div className="input-group input-group-lg border rounded-3 overflow-hidden">
                            <span className="input-group-text bg-white border-0 text-muted"><Ruler size={18} /></span>
                            <Form.Control 
                              type="number" 
                              className="border-0 bg-white"
                              value={measurements.waist}
                              onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                              placeholder="00"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>

                  {/* Results Display Area */}
                  <div className="mt-5 pt-4 border-top">
                    {loading ? (
                      <div className="text-center py-4"><Spinner animation="grow" size="sm" /></div>
                    ) : !measurements.chest ? (
                      <div className="text-center py-4 bg-light rounded-4 border-dashed border-2">
                        <p className="text-muted mb-0">Zadejte prosím alespoň obvod hrudníku pro první doporučení.</p>
                      </div>
                    ) : evaluation === "M2M" ? (
                      <div className="bg-dark text-white p-4 rounded-4 shadow-sm text-center">
                        <AlertTriangle className="mb-3 text-warning" size={32} />
                        <h4>Potřebujete něco speciálního</h4>
                        <p className="small opacity-75">Vaše rozměry jsou unikátní a nepasují do standardní tabulky. Pro tento luxusní kousek doporučujeme naše zakázkové šití.</p>
                        <Button variant="outline-light" className="rounded-pill px-4">Přejít na šití na míru</Button>
                      </div>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div>
                            <span className="text-muted small text-uppercase fw-bold">Doporučená velikost</span>
                            <h2 className="mb-0 fw-bold display-6">{evaluation.size}</h2>
                          </div>
                          <div className="text-end">
                            <Badge bg="success" className="rounded-pill px-3 py-2">95% Match</Badge>
                          </div>
                        </div>

                        <FitScale 
                          label="Hrudník" 
                          userValue={measurements.chest} 
                          min={evaluation.chest_min} 
                          max={evaluation.chest_max} 
                          sizeName={evaluation.size}
                        />

                        <FitScale 
                          label="Pas" 
                          userValue={measurements.waist} 
                          min={evaluation.waist_min} 
                          max={evaluation.waist_max} 
                          sizeName={evaluation.size}
                        />

                        <div className="d-grid mt-4">
                          <Button variant="dark" size="lg" className="rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                            <ShoppingBag size={20} /> Vložit velikost {evaluation.size} do košíku
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
            
            <p className="text-center mt-4 text-muted small">
              <HelpCircle size={14} className="me-1" /> 
              Nejste si jistí, jak se změřit? <a href="#" className="text-dark fw-bold">Podívejte se na náš video-návod</a>.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}