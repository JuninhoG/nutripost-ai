exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' }
        }

          const { tema, publico, tono, numSlides, ctaType } = JSON.parse(event.body)

            const ctaTexts = {
                seguir: 'Seguime para más consejos de nutrición',
                    consulta: 'Agendá tu consulta — link en bio',
                        guardar: 'Guardá este post para no olvidarlo'
                          }

                            const prompt = `Eres un experto en nutrición clínica y marketing de contenidos para Instagram. Genera el contenido para un carrusel de ${numSlides} slides sobre: "${tema}"
                            Público objetivo: ${publico || 'adultos interesados en nutrición saludable'}
                            Tono: ${tono}
                            CTA final: "${ctaTexts[ctaType]}"

                            RESPONDE SOLO con un JSON válido, sin texto antes ni después, sin backticks. Estructura exacta:
                            {
                              "titulo_carrusel": "título SEO del carrusel",
                                "slides": [
                                    { "tipo": "portada", "titulo": "Título gancho impactante máx 8 palabras", "cuerpo": "" },
                                        { "tipo": "contenido", "titulo": "Subtítulo", "puntos": ["punto 1", "punto 2", "punto 3"] },
                                            { "tipo": "dato", "titulo": "Dato impactante", "cuerpo": "Explicación breve" }
                                              ]
                                              }
                                              El último slide: tipo "cta", campo "cta": "${ctaTexts[ctaType]}", titulo motivador.
                                              Genera exactamente ${numSlides} slides. JSON perfectamente válido.`

                                                try {
                                                    const response = await fetch(
                                                          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                                                                {
                                                                        method: 'POST',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                        body: JSON.stringify({
                                                                                                  contents: [{ parts: [{ text: prompt }] }],
                                                                                                            generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
                                                                                                                    })
                                                                                                                          }
                                                                                                                              )
                                                                                                                              
                                                                                                                                  const data = await response.json()
                                                                                                                                      const rawText = data.candidates[0].content.parts[0].text
                                                                                                                                          const clean = rawText.replace(/```json|```/g, '').trim()
                                                                                                                                              const parsed = JSON.parse(clean)
                                                                                                                                              
                                                                                                                                                  return {
                                                                                                                                                        statusCode: 200,
                                                                                                                                                              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                                                                                                                                                                    body: JSON.stringify({ ok: true, data: parsed })
                                                                                                                                                                        }
                                                                                                                                                                          } catch (err) {
                                                                                                                                                                              return {
                                                                                                                                                                                    statusCode: 500,
                                                                                                                                                                                          body: JSON.stringify({ ok: false, error: err.message })
                                                                                                                                                                                              }
                                                                                                                                                                                                }
                                                                                                                                                                                                }
