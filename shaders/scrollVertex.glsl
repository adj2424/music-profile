#define PI 3.1415926538
uniform float textLength;

void main () {
  float scale = 1.0 / textLength * PI * 1.98;
  float theta = -position.x * scale;
  float r = 0.5;
  float r2 = r + position.y * scale * r;
  float posX = cos(theta) * r2;
  float posY = sin(theta) * r2;

  vec3 p = vec3(posX, posY, position.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4 (p, 1.0);
}