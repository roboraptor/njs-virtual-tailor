'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Ruler, Download, HelpCircle, Check, Info } from 'lucide-react';

// --- KONFIGURACE DAT ---

// Definice všech možných měření s kódy
const MEASUREMENT_DEFS = {
  'A': { id: 'head', label: 'Obvod hlavy', description: 'Měřte v nejširším místě přes čelo.' },
  'B': { id: 'neck', label: 'Obvod krku', description: 'Měřte u kořene krku, nad klíčními kostmi.' },
  'C': { id: 'shoulder', label: 'Šíře ramen', description: 'Od ramenního kloubu k druhému přes záda.' },
  'D': { id: 'chest', label: 'Obvod hrudníku', description: 'Přes nejširší místo prsou, v podpaží.' },
  'E': { id: 'waist', label: 'Obvod pasu', description: 'V nejužším místě trupu, nad pupíkem.' },
  'F': { id: 'hips', label: 'Obvod boků', description: 'Přes nejširší část hýždí.' },
  'G': { id: 'arm_length', label: 'Délka ruky', description: 'Od ramenního kloubu po zápěstí, ruka mírně pokrčená.' },
  'H': { id: 'thigh', label: 'Obvod stehna', description: 'V nejširším místě stehna.' },
  'I': { id: 'inseam', label: 'Vnitřní délka nohy', description: 'Od rozkroku po kotník.' },
};

// Definice produktových řad a jejich vyžadovaných měření
const PRODUCT_LINES = [
  { id: 'tunic', name: 'Základní Tunika', requirements: ['B', 'C', 'D', 'E', 'G'] },
  { id: 'trousers', name: 'Kalhoty / Nohavice', requirements: ['E', 'F', 'H', 'I'] },
  { id: 'hood', name: 'Kápě / Pokrývka hlavy', requirements: ['A', 'B'] },
  { id: 'gambeson', name: 'Prošívanice (Gambeson)', requirements: ['B', 'C', 'D', 'E', 'F', 'G'] },
];

/**
 * Komponenta BodyVisualizer
 * Načte tvůj obrázek (body.png) a vykresluje interaktivní čáry.
 */
const BodyVisualizer = ({ activeCode }) => {
  // Barvy
  const strokeDefault = "#e9ecef";
  const strokeActive = "#0d6efd"; // Bootstrap primary blue
  const strokeWidth = 5;

  // Pomocná funkce pro barvu čáry
  const getStroke = (code) => activeCode === code ? strokeActive : strokeDefault;
  const getOpacity = (code) => activeCode === code ? 1 : 0.4;
  const getZ = (code) => activeCode === code ? 10 : 1;

  return (
    <div className="position-relative w-100 h-100 d-flex justify-content-center">
      <svg viewBox="0 0 400 600" className="w-100 h-auto" style={{ maxHeight: '600px', maxWidth: '400px' }}>
        
        {/* --- TVŮJ OBRÁZEK --- 
           Aby to fungovalo, ujisti se, že máš soubor 'body.png' v složce 'public' v projektu. 
        */}
        <image 
          href="/body.png" 
          x="0" 
          y="0" 
          width="400" 
          height="600" 
          preserveAspectRatio="xMidYMid slice" // Ořezává obrázek, aby se vešel
          opacity="0.2" // Ztmavíme, aby čáry vynikly. Můžeš zvýšit na 1.
        />
        
        {/* Fallback pro případ, že obrázek chybí - jednoduchý obrys */}
        <path d="M200,50 Q230,50 230,80 Q230,110 200,110 Q170,110 170,80 Q170,50 200,50 M170,95 L140,110 L90,110 L80,250 L100,260 L120,180 L120,250 L110,400 L130,580 L190,580 L195,400 L205,400 L210,580 L270,580 L290,400 L280,250 L280,180 L300,260 L320,250 L310,110 L260,110 L230,95" 
          fill="none" stroke="#adb5bd" strokeWidth="2" opacity="0.1" 
        />

        {/* --- MĚŘÍCÍ ČÁRY (PŘIZPŮSOBENÉ NA FORMÁT 400x600) --- */}
        
        {/* A - Hlava (výška cca 80) */}
        <ellipse cx="200" cy="80" rx="35" ry="12" 
          fill="none" stroke={getStroke('A')} strokeWidth={strokeWidth} opacity={getOpacity('A')} 
        />
        
        {/* B - Krk (výška cca 115) */}
        <path d="M180,115 Q200,125 220,115" 
          fill="none" stroke={getStroke('B')} strokeWidth={strokeWidth} opacity={getOpacity('B')} 
        />

        {/* C - Ramena (výška cca 130) */}
        <line x1="140" y1="130" x2="260" y2="130" 
          stroke={getStroke('C')} strokeWidth={strokeWidth} opacity={getOpacity('C')} strokeLinecap="round" 
        />

        {/* D - Hrudník (výška cca 180) */}
        <path d="M130,180 Q200,195 270,180" 
          fill="none" stroke={getStroke('D')} strokeWidth={strokeWidth} opacity={getOpacity('D')} 
        />

        {/* E - Pas (výška cca 250) */}
        <path d="M125,250 Q200,265 275,250" 
          fill="none" stroke={getStroke('E')} strokeWidth={strokeWidth} opacity={getOpacity('E')} 
        />

        {/* F - Boky (výška cca 310) */}
        <path d="M115,310 Q200,325 285,310" 
          fill="none" stroke={getStroke('F')} strokeWidth={strokeWidth} opacity={getOpacity('F')} 
        />

        {/* G - Ruka (délka) - od ramene (140,130) k zápěstí (80,250) */}
        <path d="M260,130 Q300,180 320,250"
          fill="none" stroke={getStroke('G')} strokeWidth={strokeWidth} opacity={getOpacity('G')} strokeDasharray="5,5"
        />

        {/* H - Stehno (výška cca 360, levá noha z pohledu diváka) */}
        <path d="M115,360 Q150,370 185,360" 
          fill="none" stroke={getStroke('H')} strokeWidth={strokeWidth} opacity={getOpacity('H')} 
        />

        {/* I - Vnitřní noha (výška cca 340 až 580) */}
        <line x1="195" y1="340" x2="195" y2="580" 
          stroke={getStroke('I')} strokeWidth={strokeWidth} opacity={getOpacity('I')} strokeDasharray="5,5"
        />
        
        {/* Popisky k čarám (zobrazí se jen když je aktivní) */}
        {activeCode && (
          <text x="20" y="40" fill="#0d6efd" fontSize="24" fontWeight="bold">
            {activeCode} - {MEASUREMENT_DEFS[activeCode].label}
          </text>
        )}
      </svg>
    </div>
  );
};

export default function App() {
  const [selectedProducts, setSelectedProducts] = useState(['tunic']); // Defaultně vybrána tunika
  const [activeMeasurement, setActiveMeasurement] = useState(null); // Které pole je právě "focused"
  const [measurements, setMeasurements] = useState({}); // Uložené hodnoty
  const [devMode, setDevMode] = useState(false);

  // Vypočítá unikátní seznam potřebných měření podle vybraných produktů
  const requiredMeasurements = useMemo(() => {
    const codes = new Set();
    selectedProducts.forEach(prodId => {
      const product = PRODUCT_LINES.find(p => p.id === prodId);
      if (product) {
        product.requirements.forEach(r => codes.add(r));
      }
    });
    // Seřadíme abecedně (A, B, C...)
    return Array.from(codes).sort();
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
      setMeasurements({
        'A': '58', 'B': '42', 'C': '48', 'D': '102', 'E': '90', 'F': '105', 'G': '65', 'H': '60', 'I': '82'
      });
    }
  }, [devMode]);

  return (
    <div className="bg-light min-vh-100 font-sans pb-5">
      <Container className="py-5" style={{ maxWidth: '1000px' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <div>
            <h1 className="h2 fw-bold mb-0 text-dark">Konfigurátor Měření</h1>
            <p className="text-muted small mb-0">Vyberte produkty a zadejte potřebné míry pro zakázkovou výrobu.</p>
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
              Stáhnout JSON
            </Button>
          </div>
        </div>

        {/* 1. KROK: Výběr produktů (Tabulka) */}
        <Card className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
          <Card.Header className="bg-white p-4 border-bottom">
            <h5 className="fw-bold m-0">1. O co máte zájem?</h5>
          </Card.Header>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted text-uppercase small" style={{ width: '40%' }}>Název produktové řady</th>
                  <th className="text-center py-3 text-muted text-uppercase small" style={{ width: '20%' }}>Mám zájem</th>
                  <th className="pe-4 py-3 text-muted text-uppercase small text-end" style={{ width: '40%' }}>Potřebné značky</th>
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
               Vyberte alespoň jeden produkt pro zobrazení formuláře měření.
             </div>
          )}
        </Card>

        {/* 2. KROK: Měření (Split View) */}
        {selectedProducts.length > 0 && (
          <Row className="g-4">
            {/* Levá strana - Vizuál */}
            <Col lg={5} className="d-none d-lg-block">
              <Card className="border-0 shadow-sm rounded-4 h-100 position-sticky" style={{ top: '20px' }}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center bg-white rounded-4 p-0 overflow-hidden">
                  <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                    <BodyVisualizer activeCode={activeMeasurement} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Pravá strana - Inputy */}
            <Col lg={7}>
              <Card className="border-0 shadow-sm rounded-4 bg-white">
                <Card.Header className="bg-white p-4 border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold m-0">2. Zadejte své míry</h5>
                    <Badge bg="light" text="dark" className="border">
                      {requiredMeasurements.length} položek k vyplnění
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
                        Odeslat měření
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