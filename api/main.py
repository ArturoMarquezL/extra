from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import *
from fastapi import *
from pydantic import *
from typing import *
import databases


class Producto(BaseModel):
    id_producto: int
    producto: str
    precio: float
    existencias: int

class ProductoIN(BaseModel):
    producto: str
    precio: float
    existencias: int

class message(BaseModel):
    message: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATABASE_URL = 'sqlite:///evaluacion.db'

database = databases.Database(DATABASE_URL)

metadata = MetaData()

engine = create_engine(DATABASE_URL)

productos = Table( #tabla
    'clientes', metadata,
    Column('id_producto', Integer, primary_key=True),
    Column('producto', String, nullable=False),
    Column('precio', Float, nullable=False),
    Column('existencias', Integer, nullable=False)
)

metadata.create_all(engine)

@app.get("/productos/", response_model=List[Producto])
async def get_all_products():
    stmt = select(productos)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        return [dict(row) for row in result.fetchall()]

@app.post("/productos/", response_model=message)
async def create_product(producto: ProductoIN):
    stmt = insert(productos).values(producto=producto.producto, precio=producto.precio, existencias=producto.existencias)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        return {"message": "producto creado"}

@app.get("/productos/{id_producto}", response_model=Producto)
async def get_a_single_product(id_producto: int):
    stmt = select(productos).where(productos.c.id_producto == id_producto)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        return dict(result.fetchone())

@app.put("/productos/{id_producto}", response_model=message)
async def update_product(id_producto: int, producto: ProductoIN):
    stmt = update(productos).where(productos.c.id_producto == id_producto).values(producto=producto.producto, precio=producto.precio, existencias=producto.existencias)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        return {"message": "Cliente actualizado"}

@app.delete("/productos/{id_producto}", response_model=message)
async def delete_product(id_producto: int):
    stmt = delete(productos).where(productos.c.id_producto == id_producto)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        return {"message": "Cliente eliminado"}

