'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Ruler, Download, HelpCircle, Check, Info } from 'lucide-react';

// --- KONFIGURACE DAT ---

// Definition of all possible measurements with codes
const MEASUREMENT_DEFS = {
  '1': { id: 'around_neck', label: 'Around neck', description: 'Measurement around the neck.' },
  '2': { id: 'neck_to_ankle', label: 'Neck to ankle', description: 'Measurement from neck to ankle.' },
  '3': { id: 'neck_to_crotch', label: 'Neck to crotch', description: 'Measurement from neck to crotch.' },
  '4': { id: 'neck_to_wrist', label: 'Neck to wrist', description: 'Measurement from neck to wrist.' },
  '5': { id: 'armpit_to_wrist', label: 'Armpit to wrist', description: 'Measurement from armpit to wrist.' },
  '6': { id: 'around_wrist', label: 'Around wrist', description: 'Measurement around the wrist.' },
  '7': { id: 'shoulder_to_elbow', label: 'Shoulder to elbow', description: 'Measurement from shoulder to elbow.' },
  '8': { id: 'elbow_to_wrist', label: 'Elbow to wrist', description: 'Measurement from elbow to wrist.' },
  '9': { id: 'crotch_to_knee', label: 'Crotch to knee', description: 'Measurement from crotch to knee.' },
  '10': { id: 'knee_to_ankle', label: 'Knee to ankle', description: 'Measurement from knee to ankle.' },
  '11': { id: 'around_knee', label: 'Around knee', description: 'Measurement around the knee.' },
  '12': { id: 'around_shin', label: 'Around shin', description: 'Measurement around the shin.' },
  '13': { id: 'around_ankle', label: 'Around ankle', description: 'Measurement around the ankle.' },
  '14': { id: 'shoulder_to_shoulder', label: 'Shoulder to shoulder', description: 'Measurement from shoulder to shoulder.' },
  '15': { id: 'around_shoulder', label: 'Around shoulder', description: 'Measurement around the shoulder.' },
  '16': { id: 'neck_to_tailbone', label: 'Neck to tailbone/end of buttcrack', description: 'Measurement from neck to tailbone.' },
  '17': { id: 'around_bicep', label: 'Around bicep', description: 'Measurement around the bicep.' },
  '18': { id: 'around_elbow', label: 'Around elbow', description: 'Measurement around the elbow.' },
  '19': { id: 'around_chest', label: 'Around chest', description: 'Measurement around the chest.' },
  '20': { id: 'around_bust', label: 'Around bust', description: 'Measurement around the bust.' },
  '21': { id: 'around_stomach', label: 'Around stomach', description: 'Measurement around the stomach.' },
  '22': { id: 'around_hips', label: 'Around hips', description: 'Measurement around the hips.' },
  '23': { id: 'crotch_to_ankle', label: 'Crotch to ankle', description: 'Measurement from crotch to ankle.' },
  '24': { id: 'around_thigh', label: 'Around thigh', description: 'Measurement around the thigh.' },
  '25': { id: 'around_calf', label: 'Around calf', description: 'Measurement around the calf.' },
  '26': { id: 'width_of_hand', label: 'Width of hand', description: 'Measurement of the width of the hand.' },
  '27': { id: 'wrist_to_middle_finger_tip', label: 'Wrist to middle finger tip', description: 'Measurement from wrist to middle finger tip.' },
  '28': { id: 'around_fingers', label: 'Around fingers (average thickness)', description: 'Average thickness around fingers.' },
};

// Definition of product lines and their required measurements
const PRODUCT_LINES = [
  { id: 'tunic', name: 'Basic Tunic', requirements: ['1', '4', '14', '19', '21'] },
  { id: 'trousers', name: 'Trousers / Pants', requirements: ['21', '22', '23', '24'] },
  { id: 'hood', name: 'Hood / Headgear', requirements: ['1', '14'] },
  { id: 'gambeson', name: 'Gambeson (Padded Jack)', requirements: ['1', '4', '14', '19', '21', '22'] },
];

/**
 * BodyVisualizer Component
 * Loads the body image and swaps it based on the active measurement code.
 */
const BodyVisualizer = ({ activeCode }) => {
  // Map the active measurement code to a specific image file
  const getImageSource = () => {
    if (!activeCode) return '/body.png';
    return `/body-${activeCode}.png`;
  };

  return (
    <div className="position-relative w-100 h-100 d-flex justify-content-center align-items-center bg-light">
      <img 
        src={getImageSource()} 
        alt={`Measurement ${activeCode ? MEASUREMENT_DEFS[activeCode].label : 'default'}`} 
        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        onError={(e) => {
          // Fallback to default body if specific image is not found
          e.target.onerror = null;
          e.target.src = '/body.png';
        }}
      />
      {activeCode && (
        <div className="position-absolute top-0 start-0 m-3 p-2 bg-white border rounded shadow-sm" style={{ zIndex: 10 }}>
          <strong className="text-primary">{activeCode}</strong> - {MEASUREMENT_DEFS[activeCode].label}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [selectedProducts, setSelectedProducts] = useState(['tunic']); // Tunic selected by default
  const [activeMeasurement, setActiveMeasurement] = useState(null); // Which field is currently focused
  const [measurements, setMeasurements] = useState({}); // Saved values
  const [devMode, setDevMode] = useState(false);

  // Calculates unique list of required measurements based on selected products
  const requiredMeasurements = useMemo(() => {
    const codes = new Set();
    selectedProducts.forEach(prodId => {
      const product = PRODUCT_LINES.find(p => p.id === prodId);
      if (product) {
        product.requirements.forEach(r => codes.add(r));
      }
    });
    // Sort numerically rather than alphabetically
    return Array.from(codes).sort((a, b) => parseInt(a) - parseInt(b));
  }, [selectedProducts]);

  const toggleProduct = (prodId) => {
    setSelectedProducts(prev => {
      if (prev.includes(prodId)) {
        return prev.filter(p => p !== prodId);
      } else {
        return [...prev, prodId];
      }
    });
  };

  const handleDownloadJson = () => {
    const exportData = {
      selected_products: selectedProducts.map(id => PRODUCT_LINES.find(p => p.id === id).name),
      measurements: measurements,
      date: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "measurements_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  useEffect(() => {
    if (devMode) {
      const mockData = {};
      for (let i = 1; i <= 28; i++) {
        mockData[i.toString()] = (Math.floor(Math.random() * 40) + 40).toString();
      }
      setMeasurements(mockData);
    }
  }, [devMode]);

  return (
    <div className="bg-light min-vh-100 font-sans pb-5">
      <Container className="py-5" style={{ maxWidth: '1000px' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <div>
            <h1 className="h2 fw-bold mb-0 text-dark">Measurement Configurator</h1>
            <p className="text-muted small mb-0">Select products and enter the necessary measurements for custom tailoring.</p>
          </div>
          <div className="d-flex gap-3 align-items-center">
             <Form.Check 
                type="switch"
                id="dev-switch"
                label="Dev Data"
                checked={devMode}
                onChange={() => setDevMode(!devMode)}
              />
            <Button variant="outline-dark" size="sm" onClick={handleDownloadJson}>
              <Download size={16} className="me-2" />
              Download JSON
            </Button>
          </div>
        </div>

        {/* STEP 1: Product Selection (Table) */}
        <Card className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
          <Card.Header className="bg-white p-4 border-bottom">
            <h5 className="fw-bold m-0">1. What are you interested in?</h5>
          </Card.Header>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted text-uppercase small" style={{ width: '40%' }}>Product Line</th>
                  <th className="text-center py-3 text-muted text-uppercase small" style={{ width: '20%' }}>Interested</th>
                  <th className="pe-4 py-3 text-muted text-uppercase small text-end" style={{ width: '40%' }}>Required measurements</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCT_LINES.map(product => {
                  const isSelected = selectedProducts.includes(product.id);
                  return (
                    <tr key={product.id} className={isSelected ? 'bg-primary-subtle' : ''}>
                      <td className="ps-4 fw-medium">{product.name}</td>
                      <td className="text-center">
                        <Form.Check 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProduct(product.id)}
                          style={{ transform: 'scale(1.2)' }}
                        />
                      </td>
                      <td className="pe-4 text-end">
                        <div className="d-flex justify-content-end gap-1 flex-wrap">
                          {product.requirements.map(code => (
                            <Badge key={code} bg="secondary" className="fw-normal bg-opacity-75">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {selectedProducts.length === 0 && (
             <div className="p-3 text-center text-muted bg-light small">
               <Info size={16} className="me-2"/>
               Select at least one product to display the measurement form.
             </div>
          )}
        </Card>

        {/* STEP 2: Measurements (Split View) */}
        {selectedProducts.length > 0 && (
          <Row className="g-4">
            {/* Left side - Visuals */}
            <Col lg={5} className="d-none d-lg-block">
              <Card className="border-0 shadow-sm rounded-4 h-100 position-sticky" style={{ top: '20px' }}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center bg-white rounded-4 p-0 overflow-hidden">
                  <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                    <BodyVisualizer activeCode={activeMeasurement} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Right side - Inputs */}
            <Col lg={7}>
              <Card className="border-0 shadow-sm rounded-4 bg-white">
                <Card.Header className="bg-white p-4 border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold m-0">2. Enter your measurements</h5>
                    <Badge bg="light" text="dark" className="border">
                      {requiredMeasurements.length} items to fill
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <Form>
                    <Row className="g-4">
                      {requiredMeasurements.map(code => {
                        const def = MEASUREMENT_DEFS[code];
                        const isActive = activeMeasurement === code;
                        
                        return (
                          <Col md={12} key={code}>
                            <div 
                              className={`p-3 rounded-3 border transition-all ${isActive ? 'border-primary bg-primary-subtle' : 'bg-light border-light'}`}
                              style={{ transition: 'all 0.2s ease' }}
                            >
                              <Form.Group>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <Form.Label className={`mb-0 fw-bold d-flex align-items-center ${isActive ? 'text-primary' : ''}`}>
                                    <span className={`d-inline-flex align-items-center justify-content-center rounded-circle me-2 ${isActive ? 'bg-primary text-white' : 'bg-dark text-white'}`} style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                                      {code}
                                    </span>
                                    {def.label}
                                  </Form.Label>
                                  <OverlayTrigger
                                    placement="left"
                                    overlay={<Tooltip>{def.description}</Tooltip>}
                                  >
                                    <HelpCircle size={16} className="text-muted cursor-pointer" />
                                  </OverlayTrigger>
                                </div>
                                
                                <div className="input-group">
                                  <Form.Control
                                    type="number"
                                    placeholder="0"
                                    value={measurements[code] || ''}
                                    onChange={(e) => setMeasurements({...measurements, [code]: e.target.value})}
                                    onFocus={() => setActiveMeasurement(code)}
                                    className="border-0 shadow-none bg-white"
                                    style={{ fontSize: '1.1rem' }}
                                  />
                                  <span className="input-group-text bg-white border-0 text-muted">cm</span>
                                </div>
                              </Form.Group>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>

                    <div className="mt-5 d-grid">
                      <Button variant="dark" size="lg" className="py-3 rounded-pill fw-bold">
                        <Check size={20} className="me-2" />
                        Submit measurements
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}